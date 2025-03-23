"use client";

import BottomNavigation from "@/components/BottomNavigation";
import { usePreferences } from "@/hooks/usePreferences";
import { formatAmount } from "@/lib/currency";
import { DateLibs } from "@/lib/date";
import { SubscriptionType } from "@/lib/subscription/enum";
import { cn } from "@/lib/utils";
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
import { motion } from "framer-motion";
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
  const { currency } = usePreferences();
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
    <div className="flex flex-col w-full min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="w-full flex items-center h-[70px] justify-between px-6 bg-white shadow-sm sticky top-0 bottom-auto z-10">
        <h2 className="text-xl font-bold text-[#0D062D]">Calendar</h2>
        <div className="flex items-center gap-x-4"></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-6 gap-y-6">
        {/* Calendar Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex w-full flex-col gap-y-6">
            <div className="flex justify-between w-full items-center">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-[#0D062D]">
                  {info.month}
                </h2>
              </div>
              <div className="flex gap-x-3 items-center">
                <button
                  onClick={() => onDateChange(subMonths(calendarDate, 1))}
                  className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CircleChevronLeft className="w-5 h-5 text-[#787486] stroke-[1.5]" />
                </button>
                <button
                  onClick={() => onDateChange(addMonths(calendarDate, 1))}
                  className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CircleChevronRight className="w-5 h-5 text-[#787486] stroke-[1.5]" />
                </button>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <div className="grid grid-cols-7 py-4 w-full gap-y-4 gap-x-1">
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
                        <Link
                          href={href}
                          className={cn(
                            classNames.div,
                            "hover:bg-gray-50 transition-colors rounded-full"
                          )}
                        >
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
        </div>

        {/* Subscriptions Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex-1">
          <div className="flex flex-col w-full gap-y-6">
            <div className="flex w-full flex-col gap-y-2">
              <h2 className="text-lg font-bold text-[#0D062D]">
                <span className="text-2xl">{subInfo.day}</span>{" "}
                <span>{subInfo.month}</span>
              </h2>
              {data && (
                <p className="text-sm text-[#787486]">
                  {data.length} subscriptions
                </p>
              )}
            </div>

            <div className="flex w-full flex-col divide-y divide-gray-100">
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
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex py-4 items-center justify-between hover:bg-gray-50 transition-colors px-4 rounded-lg"
                      >
                        <div className="flex flex-col gap-y-1">
                          <div className="flex gap-x-3 items-center">
                            {sub.icon && (
                              <span className="text-2xl">{sub.icon}</span>
                            )}
                            <div className="flex flex-col">
                              <h3 className="font-semibold text-[#0D062D]">
                                {sub.name}
                              </h3>
                              <p className="text-sm text-[#787486]">{text}</p>
                            </div>
                          </div>
                        </div>
                        <span className="font-medium text-[#0D062D]">
                          {formatAmount(sub.amount, currency)}
                        </span>
                      </motion.div>
                    );
                  })}
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white sticky bottom-0 top-auto">
        <BottomNavigation />
      </div>
    </div>
  );
}

export const runtime = "edge";
