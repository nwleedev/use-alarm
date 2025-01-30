import { DateLibs } from "@/lib/date";
import PocketBaseLibs from "@/lib/pocket-base";
import { SubscriptionType } from "@/lib/subscription/enum";
import { Subscription } from "@/models/subscription";
import { UserRound } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const client = PocketBaseLibs.getClient();
  client.authStore.loadFromCookie(cookies().toString());

  const months = await client
    .collection("subscriptions")
    .getList<Subscription<true>>(0, 10, {
      expand: "user",
      filter: `type = '${SubscriptionType.MONTH}'`,
    });

  const weeks = await client
    .collection("subscriptions")
    .getList<Subscription<true>>(0, 10, {
      expand: "user",
      filter: `type = '${SubscriptionType.WEEK}'`,
    });

  // subs.items[0]
  return (
    <div className="flex flex-col w-full px-4 gap-y-4">
      <div className="w-full flex items-center h-[60px] justify-between gap-x-4 px-2">
        <h2 className="text-xl font-semibold whitespace-nowrap flex-shrink-0">
          Use Alarm
        </h2>
        <div className="w-full flex items-center justify-end gap-x-2">
          <Link href={"/new"}>New item</Link>
          <Link href={"/account"}>
            <UserRound />
          </Link>
        </div>
      </div>
      <div className="p-2">
        <h2 className="text-2xl font-bold">Monthly</h2>
      </div>
      <div className="flex flex-col w-full divide-y">
        {months.items.map((sub) => {
          return (
            <Link
              href={`/subscription/${sub.id}`}
              key={sub.id}
              className="flex items-center px-2 py-4 gap-x-2"
            >
              <div className="flex flex-col w-full gap-y-2">
                <div className="flex gap-x-4">
                  {sub.icon && (
                    <div className="flex justify-center items-center">
                      <p className="text-2xl">{sub.icon}</p>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">{sub.name}</h2>
                    <p className="text-gray-500 font-normal">
                      {sub.description}
                    </p>
                  </div>
                </div>
                <div className="w-full flex items-center text-sm text-gray-600 divide-x-2 gap-x-2">
                  <span className="">
                    Payment on the {DateLibs.formatDate(sub.payment)}
                  </span>
                  <span className="px-2">₩{sub.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-xl">
                  {DateLibs.formatDate(sub.alarm)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="p-2">
        <h2 className="text-2xl font-bold">Weekly</h2>
      </div>
      <div className="flex flex-col w-full divide-y">
        {weeks.items.map((sub) => {
          return (
            <Link
              href={`/subscription/${sub.id}`}
              key={sub.id}
              className="flex items-center px-2 py-4 gap-x-2"
            >
              <div className="flex flex-col w-full gap-y-2">
                <div className="flex gap-x-4">
                  {sub.icon && (
                    <div className="flex justify-center items-center">
                      <p className="text-2xl">{sub.icon}</p>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">{sub.name}</h2>
                    <p className="text-gray-500 font-normal">
                      {sub.description}
                    </p>
                  </div>
                </div>
                <div className="w-full flex items-center text-sm text-gray-600 divide-x-2 gap-x-2">
                  <span className="">
                    Payment on {DateLibs.formatDay(sub.payment)}
                  </span>
                  <span className="px-2">₩{sub.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-xl">
                  {DateLibs.formatDay(sub.alarm)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
