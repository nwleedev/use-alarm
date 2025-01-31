import {
  format,
  getDate,
  getDay,
  getMonth,
  lastDayOfMonth,
  setDate,
  setDay,
  subDays,
} from "date-fns";
import dotenv from "dotenv";
import { Notification } from "models/notification";
import { Subscription } from "models/subscription";
import PocketBase from "pocketbase";
import webpush from "web-push";

dotenv.config();

const NEXT_PUBLIC_VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const MAILTO = `mailto:${process.env.ADMIN_EMAIL}`;

webpush.setVapidDetails(
  MAILTO,
  NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const app = async () => {
  const now = new Date();
  const api = "http://127.0.0.1:3002";
  const pocketbase = new PocketBase(api);

  const notis = await pocketbase
    .collection("notifications")
    .getList<Notification<true>>(1, 10, {
      sort: "-created",
      headers: {
        Authorization: process.env.ADMIN_API_KEY,
      },
    });

  const size = notis.items.length;
  for (let i = 0; i < size; i++) {
    try {
      const item = notis.items[i];
      const subs = await pocketbase
        .collection("subscriptions")
        .getFullList<Subscription>({
          headers: {
            Authorization: process.env.ADMIN_API_KEY,
          },
        });
      const subLen = subs.length;
      for (let i = 0; i < subLen; i++) {
        const sub = subs[i];

        if (sub.type === "MONTH") {
          const now = new Date();
          let payment = setDate(new Date(), sub.payment);

          if (getMonth(payment) !== getMonth(now)) {
            payment = lastDayOfMonth(now);
          }

          const alarm = subDays(payment, sub.alarm);
          const body = `${sub.name} Payment will be charged after ${
            sub.alarm
          } ${sub.alarm === 1 ? `day` : `days`}.`;

          if (getDate(now) === getDate(alarm)) {
            await webpush.sendNotification(
              { endpoint: item.endpoint, keys: item.keys },
              JSON.stringify({
                title: "Payment Alarm - Use Alarm",
                body,
                icon: sub.icon,
              })
            );
          }
        } else if (sub.type === "WEEK") {
          const day = getDay(new Date());
          if (day === sub.alarm) {
            if (sub.alarm <= sub.payment) {
              const payment = setDay(new Date(), sub.payment);
              const body = `${sub.name} Payment will be charged this ${format(
                payment,
                "EEEE"
              )}`;
              await webpush.sendNotification(
                { endpoint: item.endpoint, keys: item.keys },
                JSON.stringify({
                  title: "Payment Alarm - Use Alarm",
                  body,
                  icon: sub.icon,
                })
              );
            } else {
              const payment = setDay(new Date(), sub.payment);
              const body = `${sub.name} Payment will be charged next ${format(
                payment,
                "EEEE"
              )}`;
              await webpush.sendNotification(
                { endpoint: item.endpoint, keys: item.keys },
                JSON.stringify({
                  title: "Payment Alarm - Use Alarm",
                  body,
                  icon: sub.icon,
                })
              );
            }
          }
        }
      }
    } catch (error) {
      if (
        error instanceof Error &&
        "statusCode" in error &&
        error.statusCode === 410
      ) {
        continue;
      } else {
        console.log("Failed to send web push.");
      }
    }
  }
};

app();
