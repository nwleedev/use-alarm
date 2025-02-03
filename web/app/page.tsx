"use client";

import BottomNavigation from "@/components/BottomNavigation";
import SubscriptionItem from "@/components/Subscription/Item";
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
    <div className="flex flex-col w-full gap-y-4 flex-1">
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
      <div className="flex flex-col w-full flex-1 p-4">
        {subs && (
          <>
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
                  return <SubscriptionItem.Month sub={sub} key={sub.id} />;
                } else if (sub.type === SubscriptionType.WEEK) {
                  return <SubscriptionItem.Week sub={sub} key={sub.id} />;
                } else {
                  return <Fragment key={null} />;
                }
              })}
            </div>
          </>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
}

export const runtime = "edge";
