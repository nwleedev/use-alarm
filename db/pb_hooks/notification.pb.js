/// <reference path="../pb_data/types.d.ts" />

/**
 * @typedef NotificationRecord
 * @type {object}
 *
 * @property {string} id
 * @property {string} endpoint
 * @property {string} user
 * @property {string} created
 * @property {string} updated
 * @property {object} keys
 */

/**
 * @typedef Subscription
 * @type {object}
 *
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} amount
 * @property {string|undefined} icon
 * @property {"MONTH"|"WEEK"} type
 * @property {number} payment
 * @property {number} alarm
 * @property {string} created
 * @property {string} updated
 *
 */

/**
 * @typedef UserPreferences
 * @type {object}
 *
 * @property {string} timezone
 * @property {number} timezoneOffset
 * @property {number} hour
 */

cronAdd("notification", "0 */1 * * *", function () {
  try {
    const records = $app.findRecordsByFilter(
      "notifications",
      "",
      "-created",
      200,
      0
    );

    /** @type {Record<string, Array<NotificationRecord>>} */
    const init = {};

    /** @type {Record<string, Array<NotificationRecord>>} */
    const notiMap = records.reduce((map, item) => {
      const id = item.get("id");
      const keys = JSON.parse(item.getString("keys"));
      const endpoint = item.get("endpoint");
      const user = item.get("user");
      const created = item.get("created");
      const updated = item.get("updated");
      if (!(user in map)) {
        map[user] = [];
      }
      map[user].push({ id, keys, endpoint, user, created, updated });
      return map;
    }, init);

    const keys = Object.keys(notiMap);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const notifications = notiMap[key];

      // Get user preferences
      const prefRecord = $app.findFirstRecordByFilter(
        "preferences",
        `user = "${key}"`
      );

      /** @type {UserPreferences} */
      const preference = prefRecord
        ? {
            timezone: prefRecord.get("timezone"),
            timezoneOffset: prefRecord.get("timezoneOffset"),
            hour: prefRecord.get("hour") ?? 9,
            currency: prefRecord.get("currency"),
          }
        : {
            timezone: "UTC",
            timezoneOffset: 0,
            hour: 9,
            currency: "USD",
          };

      // Get current UTC hour
      const now = new Date();
      // Adjust current time based on user's timezone
      now.setMinutes(now.getMinutes() - preference.timezoneOffset);

      const currentUTCHour = now.getUTCHours();

      // Only proceed if it's the user's preferred notification hour in UTC
      if (currentUTCHour !== preference.hour) {
        continue;
      }

      const expr1 = `
        (user = {:user})
        and
        (
          (type = 'WEEK' and alarm = CAST(strftime('%w', date('now', {:offset} || ' minutes')) as INTEGER))
          or
          (
            type = 'MONTH'
            and
            CASE
              WHEN payment > CAST(strftime('%d', date('now', {:offset} || ' minutes', 'start of month', '1 months', '-1 days')) as INTEGER)
                THEN CAST(strftime('%d', date('now', {:offset} || ' minutes', alarm || ' days')) as INTEGER) = CAST(strftime('%d', date('now', {:offset} || ' minutes', 'start of month', '1 months', '-1 days')) as INTEGER)
              ELSE
                CAST(strftime('%d', date('now', {:offset} || ' minutes', alarm || ' days')) as INTEGER) = payment
            END
          )
        )
      `;

      // This offset is negative because it is based on UTC time.
      // For example, if the user is in UTC+9, the offset is -9.
      // This is why we need to multiply by -1.
      const offset = preference.timezoneOffset * -1;

      const response = $app.findAllRecords(
        "subscriptions",
        $dbx.exp(expr1, { user: key, offset })
      );

      const subscriptions = response.map((item) => {
        /** @type {Subscription} */
        const sub = {
          id: item.get("id"),
          name: item.get("name"),
          description: item.get("description"),
          amount: item.getInt("amount"),
          icon: item.get("icon"),
          type: item.get("type"),
          payment: item.getInt("payment"),
          alarm: item.getInt("alarm"),
          created: item.get("created"),
          updated: item.get("updated"),
        };
        return sub;
      });

      if (subscriptions.length > 0) {
        const notiResponse = $http.send({
          url: "http://127.0.0.1:3010",
          method: "POST",
          body: JSON.stringify({
            notifications,
            subscriptions,
            preference,
          }),
          timeout: 120,
          headers: {
            "content-type": "application/json",
          },
        });
        /** @type {NotificationRecord[]} */
        const expiredNotis = notiResponse.json;
        const notiIds = expiredNotis.map((noti) => noti.id);
        const records = $app.findRecordsByIds("notifications", notiIds);
        records.forEach((record) => {
          $app.delete(record);
        });
      }
    }
  } catch (error) {
    console.error("Error in notification cron job:", error);
  }
});
