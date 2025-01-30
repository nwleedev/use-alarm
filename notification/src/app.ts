import { addMonths, getDate, intervalToDuration, setDate } from "date-fns";
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

  const email = process.env.ADMIN_EMAIL;

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
        let alarm = new Date();
        let payment = new Date();
        alarm = setDate(alarm, sub.alarm);
        payment = setDate(payment, sub.payment);
        if (sub.alarm > sub.payment) {
          payment = addMonths(payment, 1);
        }

        const duration = intervalToDuration({ start: alarm, end: payment });
        const body = `${sub.name} Payment will be charged after ${String(
          duration.days ?? 0
        ).padStart(2, "0")} ${duration.days === 1 ? `day` : `days`}.`;

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
