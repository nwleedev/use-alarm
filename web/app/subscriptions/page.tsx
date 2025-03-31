"use client";

import BottomNavigation from "@/components/BottomNavigation";
import { FilterSheet } from "@/components/Subscription/FilterSheet";
import SubscriptionItem from "@/components/Subscription/Item";
import { SubscriptionType } from "@/lib/subscription/enum";
import { Subscription } from "@/models/subscription";
import { usePocketClient } from "@/provider/PocketBase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function Page() {
  const client = usePocketClient();
  const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const type = searchParams.get("type");
  const minAmount = searchParams.get("minAmount");
  const maxAmount = searchParams.get("maxAmount");
  const filters = {
    title,
    description,
    type,
    minAmount,
    maxAmount,
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["SUBSCRIPTIONS", filters] as const,
      queryFn: async ({ queryKey, pageParam }) => {
        const [, filters] = queryKey;
        const filter = [];

        if (filters.title) {
          filter.push(`name ~ "${filters.title}"`);
        }
        if (filters.description) {
          filter.push(`description ~ "${filters.description}"`);
        }
        if (filters.type && filters.type !== SubscriptionType.DEFAULT) {
          filter.push(`type = "${filters.type}"`);
        }
        if (filters.minAmount) {
          filter.push(`amount >= ${filters.minAmount}`);
        }
        if (filters.maxAmount) {
          filter.push(`amount <= ${filters.maxAmount}`);
        }

        const filterString = filter.length > 0 ? filter.join(" && ") : "";

        const subs = await client
          .collection("subscriptions")
          .getList<Subscription<true>>(pageParam, 10, {
            expand: "user",
            filter: filterString,
            requestKey: null,
          });
        return subs;
      },
      initialPageParam: 1,
      getNextPageParam: (...args) => {
        const [subs] = args;
        const page = subs.page;
        const totalPage = subs.totalPages;
        if (page >= totalPage) {
          return null;
        }
        return page + 1;
      },
    });

  useEffect(() => {
    if (entry?.isIntersecting && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, isFetchingNextPage, fetchNextPage, hasNextPage]);

  const subs = data?.pages.flatMap((page) => page.items);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="w-full flex items-center h-[70px] justify-between px-6 bg-white shadow-sm sticky top-0 bottom-auto z-10">
        <div className="flex items-center gap-x-4">
          <Link
            href="/home"
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#787486]" />
          </Link>
          <h2 className="text-xl font-bold text-[#0D062D]">Subscriptions</h2>
        </div>
        <div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="w-5 h-5 text-[#787486]" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col divide-y divide-gray-100">
            <Suspense>
              {subs?.map((sub) =>
                sub.type === SubscriptionType.MONTH ? (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SubscriptionItem.Month sub={sub} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SubscriptionItem.Week sub={sub} />
                  </motion.div>
                )
              )}
            </Suspense>
          </div>
          <div className="h-px w-full mt-4" ref={ref} />
        </div>
      </div>

      {/* Filter Sheet */}
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Bottom Navigation */}
      <div className="bg-white sticky bottom-0 top-auto">
        <BottomNavigation />
      </div>
    </div>
  );
}

export const runtime = "edge";
