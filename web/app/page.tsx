"use client";

import BottomNavigation from "@/components/BottomNavigation";
import SubscriptionItem from "@/components/Subscription/Item";
import { SubscriptionType } from "@/lib/subscription/enum";
import { Subscription } from "@/models/subscription";
import { usePocketClient } from "@/provider/PocketBase";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarPlus2, UserRound } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export default function Home() {
  const client = usePocketClient();
  const { data: subs, isLoading } = useQuery({
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
    <div className="flex flex-col w-full min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="w-full flex items-center h-[70px] justify-between px-6 bg-white shadow-sm sticky top-0 bottom-auto z-10">
        <h2 className="text-xl font-bold text-[#0D062D]">Use Alarm</h2>
        <div className="flex items-center gap-x-6">
          <Link
            href="/new"
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CalendarPlus2 className="w-5 h-5 text-[#787486]" />
          </Link>
          <Link
            href="/account"
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserRound className="w-5 h-5 text-[#787486]" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-6 gap-y-6">
        {isLoading && (
          <div className="w-full flex flex-col flex-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col flex-1 justify-center items-center"></div>
          </div>
        )}
        {subs && (
          <div className="w-full flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0D062D]">
                Latest Subscriptions
              </h2>
              <Link
                className="text-[#5030E5] text-sm font-medium hover:underline"
                href="/subscriptions"
              >
                View All
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col flex-1">
              <div className="flex flex-col divide-y divide-gray-100">
                {subs.items.map((sub) => {
                  if (sub.type === SubscriptionType.MONTH) {
                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <SubscriptionItem.Month sub={sub} />
                      </motion.div>
                    );
                  } else if (sub.type === SubscriptionType.WEEK) {
                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <SubscriptionItem.Week sub={sub} />
                      </motion.div>
                    );
                  } else {
                    return <Fragment key={null} />;
                  }
                })}
              </div>
            </div>
          </div>
        )}
        {subs && subs.totalItems === 0 && (
          <div className="w-full flex flex-col flex-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col flex-1 justify-center items-center">
              <div className="flex flex-col items-center gap-y-4">
                <div className="flex flex-col items-center gap-y-2">
                  <h2 className="text-xl font-bold text-[#0D062D]">
                    No subscriptions yet
                  </h2>
                  <p className="text-lg text-[#787486]">
                    Add a subscription to get started
                  </p>
                </div>
                <Link
                  href="/new"
                  className="bg-[#5030E5] text-white px-4 py-2 rounded-lg"
                >
                  Add Subscription
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white sticky bottom-0 top-auto">
        <BottomNavigation />
      </div>
    </div>
  );
}

export const runtime = "edge";
