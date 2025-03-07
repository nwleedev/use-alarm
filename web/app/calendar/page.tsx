"use client";

import BottomNavigation from "@/components/BottomNavigation";
import { DateLibs } from "@/lib/date";
import { SubscriptionType } from "@/lib/subscription/enum";
import { Subscription } from "@/models/subscription";
import { usePocketClient } from "@/provider/PocketBase";
import useCalendar from "@nwleedev/use-calendar";
import { useQuery } from "@tanstack/react-query";
import {
  addMonths,
  format,
  getDate,
  getDay,
  getMonth,
  isValid,
  subMonths,
} from "date-fns";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { isNil, isNotNil } from "ramda";
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

function validateDate(date: Date | string | undefined | null, fallback: Date) {
  if (isNil(date)) {
    return fallback;
  }
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
  const params = useSearchParams();
  const selectedDate = validateDate(params.get("date"), now);

  const {
    date: calendarDate,
    days,
    onDateChange,
  } = useCalendar({ defaultValue: selectedDate });

  const info = toInfo(calendarDate);
  const subInfo = toInfo(selectedDate);
  const pb = usePocketClient();
  const { data } = useQuery({
    queryKey: [
      "SUBSCRIPTION_BY_DATE",
      getDate(selectedDate),
      getDay(selectedDate),
    ] as const,
    queryFn: ({ queryKey }) => {
      const [, dayOfMonth, dayOfWeek] = queryKey;
      const payment = {
        month: dayOfMonth,
        week: dayOfWeek,
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
      <div className="flex flex-col w-full flex-1 p-4 gap-y-6">
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex justify-between w-full">
            <div className="flex flex-col">
              <h2 className="font-semibold">{info.month}</h2>
            </div>
            <div className="flex gap-x-2 items-end">
              <button onClick={() => onDateChange(subMonths(calendarDate, 1))}>
                <CircleChevronLeft className="stroke-[1.5]" />
              </button>
              <button onClick={() => onDateChange(addMonths(calendarDate, 1))}>
                <CircleChevronRight className="stroke-[1.5]" />
              </button>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-7 py-2 rounded bg-white w-full gap-y-1.5 gap-x-1">
              {days.map((day) => {
                const current = getMonth(day) === getMonth(calendarDate);
                const classNames = getClassnames(day, selectedDate);
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
        </div>
        <div className="flex flex-col w-full flex-1 gap-y-2">
          <div className="flex w-full flex-col gap-y-1">
            <h2>
              <span className="text-3xl font-semibold">{subInfo.day}</span>{" "}
              <span className="font-medium">{subInfo.month}</span>
            </h2>
            {data && (
              <p className="text-xs font-normal text-slate-500">
                {data.length} subscriptions
              </p>
            )}
          </div>
          <div className="flex w-full flex-col p-2 px-4 divide-y flex-1 rounded bg-white">
            <Suspense>
              {data &&
                data.map((sub) => {
                  const { id } = sub;
                  function getText() {
                    if (sub.type === SubscriptionType.MONTH) {
                      return `Alarm before ${DateLibs.formatBeforeDays(
                        sub.alarm
                      )}`;
                    } else {
                      return `Alarm on ${DateLibs.formatDay(sub.alarm)}`;
                    }
                  }
                  const text = getText();
                  return (
                    <div
                      key={id}
                      className="w-full flex py-3 items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <div className="flex gap-x-2 items-center">
                          {sub.icon && (
                            <span className="text-3xl">{sub.icon}</span>
                          )}
                          <div className="flex flex-col">
                            <h3 className="font-semibold">{sub.name}</h3>
                            <p className="text-xs font-normal">{text}</p>
                          </div>
                        </div>
                        <div></div>
                      </div>
                      <span className="font-medium">{sub.amount}</span>
                    </div>
                  );
                })}
            </Suspense>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}

export const runtime = "edge";
