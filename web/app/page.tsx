"use client";

import { DateLibs } from "@/lib/date";
import { SubscriptionType } from "@/lib/subscription/enum";
import { Subscription } from "@/models/subscription";
import { usePocketClient } from "@/provider/PocketBase";
import { useQuery } from "@tanstack/react-query";
import { CalendarPlus2, UserRound } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export default function Home() {
  const client = usePocketClient();
  const { data: subs } = useQuery({
    queryKey: ["SUBSCRIPTIONS_LATEST"],
    queryFn: async () => {
      const months = await client
        .collection("subscriptions")
        .getList<Subscription<true>>(0, 10, {
          expand: "user",
          requestKey: "SUBSCRIPTIONS_LATEST",
        });
      return months;
    },
  });

  return (
    <div className="flex flex-col w-full gap-y-4">
      <div className="w-full flex items-center h-[60px] justify-between gap-x-4 px-4 shadow-sm">
        <h2 className="text-xl font-semibold whitespace-nowrap flex-shrink-0">
          Use Alarm
        </h2>
        <div className="w-full flex items-center justify-end gap-x-4">
          <Link href={"/new"}>
            <CalendarPlus2 />
          </Link>
          <Link href={"/account"}>
            <UserRound />
          </Link>
        </div>
      </div>
      {subs && (
        <div className="flex flex-col w-full flex-1 p-4">
          <div className="p-2 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Subs</h2>
            <Link
              className="text-blue-500 font-normal text-sm border-blue-500 border-b"
              href={"/subscriptions"}
            >
              All Subscriptions
            </Link>
          </div>
          <div className="flex flex-col w-full divide-y">
            {subs.items.map((sub) => {
              if (sub.type === SubscriptionType.MONTH) {
                return <MonthItem sub={sub} key={sub.id} />;
              } else if (sub.type === SubscriptionType.WEEK) {
                return <WeekItem sub={sub} key={sub.id} />;
              } else {
                return <Fragment key={null} />;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const MonthItem = (props: { sub: Subscription<true> }) => {
  const { sub } = props;
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
            <p className="text-gray-500 font-normal">{sub.description}</p>
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
};

const WeekItem = (props: { sub: Subscription<true> }) => {
  const { sub } = props;
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
            <p className="text-gray-500 font-normal">{sub.description}</p>
          </div>
        </div>
        <div className="w-full flex items-center text-sm text-gray-600 divide-x-2 gap-x-2">
          <span className="">Payment on {DateLibs.formatDay(sub.payment)}</span>
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
};

export const runtime = "edge";
