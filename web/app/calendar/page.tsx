"use client";

import BottomNavigation from "@/components/BottomNavigation";
import SubscriptionItem from "@/components/Subscription/Item";
import { SubscriptionType } from "@/lib/subscription/enum";
import { Subscription } from "@/models/subscription";
import { usePocketClient } from "@/provider/PocketBase";
import useCalendar from "@nwleedev/use-calendar";
import { useQuery } from "@tanstack/react-query";
import { format, getDate, getDay, getMonth, isValid } from "date-fns";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { isNotNil } from "ramda";
import { Suspense, useState } from "react";

function toInfo(date: Date | string) {
  date = new Date(date);
  const day = format(date, "dd");
  const month = format(date, "MMMM");

  return { day, month };
}

function getClassnames(day: Date, date?: Date) {
  const isSaturday = getDay(day) === 6;
  const isSunday = getDay(day) === 0;
  const now =
    isNotNil(date) && format(day, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
  if (now) {
    return {
      div: "w-8 h-8 flex flex-shrink-0 justify-center items-center bg-black rounded-full",
      span: "font-normal text-sm text-white",
    };
  }
  if (isSunday) {
    return {
      div: "w-8 h-8 flex flex-shrink-0 justify-center items-center",
      span: "font-normal text-sm text-red-500",
    };
  }
  if (isSaturday) {
    return {
      div: "w-8 h-8 flex flex-shrink-0 justify-center items-center",
      span: "font-normal text-sm text-blue-500",
    };
  }
  return {
    div: "w-8 h-8 flex flex-shrink-0 justify-center items-center",
    span: "font-normal text-sm text-slate-500",
  };
}

function getDayHref(params: ReadonlyURLSearchParams, date: Date) {
  const value = format(date, "yyyy-MM-dd");
  const searchParams = new URLSearchParams(params);

  searchParams.set("date", value);
  return `/calendar?${searchParams}`;
}

function validateDate(date: Date | string, fallback: Date) {
  try {
    date = new Date(date);
    if (isValid(date)) {
      return date;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export default function Page() {
  const [now] = useState(new Date());
  const { days, onMonthChange } = useCalendar({ defaultValue: now });

  const params = useSearchParams();
  const date = validateDate(params.get("date") ?? now, now);

  const info = toInfo(date);
  const pb = usePocketClient();
  const { data } = useQuery({
    queryKey: ["SUBSCRIPTION_BY_DATE", date] as const,
    queryFn: ({ queryKey }) => {
      const [, date] = queryKey;
      const payment = {
        month: getDate(date),
        week: getDay(date),
      };
      return pb.collection("subscriptions").getFullList<Subscription<true>>({
        filter: `(type = \"${SubscriptionType.MONTH}\" && payment = ${payment.month}) || (type = \"${SubscriptionType.WEEK}\" && payment = ${payment.week})`,
      });
    },
  });

  return (
    <div className="flex flex-col w-full gap-y-4 flex-1">
      <div className="w-full flex items-center h-[60px] justify-between gap-x-4 px-4 shadow-sm">
        <h2 className="font-semibold whitespace-nowrap flex-shrink-0">
          Calendar
        </h2>
        <div className="w-full flex items-center justify-end gap-x-4"></div>
      </div>
      <div className="flex flex-col w-full flex-1 p-4 gap-y-4">
        <div className="flex flex-col gap-y-0.5">
          <h2 className="font-semibold text-xl">
            {info.month} {info.day}
          </h2>
          <div className="h-5">
            {data && (
              <span className="text-slate-500 font-normal text-sm">
                {data.length} subscriptions
              </span>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-7 py-2 rounded bg-white w-full gap-y-2">
            {days.map((day) => {
              const current = getMonth(day) === getMonth(date);
              const classNames = getClassnames(day, date);
              const href = getDayHref(params, day);

              return (
                <div
                  key={day.getTime()}
                  className="flex justify-center items-center"
                >
                  {current && (
                    <Link href={href} className={classNames.div}>
                      <span className={classNames.span}>
                        {format(day, "dd")}
                      </span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <Suspense>
            {data &&
              data.map((sub) => {
                if (sub.type === SubscriptionType.MONTH) {
                  return <SubscriptionItem.Month key={sub.id} sub={sub} />;
                }
                if (sub.type === SubscriptionType.WEEK) {
                  return <SubscriptionItem.Week key={sub.id} sub={sub} />;
                }
              })}
          </Suspense>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}

export const runtime = "edge";
