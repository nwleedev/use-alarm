import { format, setDay } from "date-fns";
import dotenv from "dotenv";
import Fastify from "fastify";
import { Notification } from "models/notification";
import { Subscription } from "models/subscription";
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

const app = Fastify({
  logger: false,
});

app.post("/", async function (req, rep) {
  const body = req.body;
  const { subscriptions, notifications } = body as {
    subscriptions: Subscription[];
    notifications: Notification[];
  };

  const response = await Promise.all(
    notifications.map(async (noti) => {
      const answers = [] as (Notification | null)[];
      for (let i = 0; i < subscriptions.length; i++) {
        const sub = subscriptions[i];
        const title = sub.icon ? `${sub.icon} ${sub.name}` : sub.name;
        const payment = setDay(new Date(), sub.payment);
        const formattedDay = format(payment, "EEEE");

        const body =
          sub.type === "MONTH"
            ? `${sub.amount} will be charged after ${sub.alarm} ${
                sub.alarm === 1 ? "day" : "days"
              }.`
            : `${sub.amount} will be charged ${
                sub.alarm <= sub.payment ? "this" : "next"
              } ${formattedDay}`;

        try {
          await webpush.sendNotification(
            { endpoint: noti.endpoint, keys: noti.keys },
            JSON.stringify({
              title,
              body,
            })
          );
          answers.push(null);
        } catch (error) {
          if (
            error instanceof Error &&
            "statusCode" in error &&
            error.statusCode === 410
          ) {
            answers.push(noti);
          } else {
            answers.push(null);
          }
        }
      }
      return answers;
    })
  );
  const expireds = response.reduce((array, items) => {
    items.forEach((item) => {
      if (item !== null) {
        array.push(item);
      }
    });
    return array;
  }, [] as Notification[]);
  rep.send(expireds);
});

app.listen({ port: 3010 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
