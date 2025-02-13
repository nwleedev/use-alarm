"use client";

import SubscriptionItem from "@/components/Subscription/Item";
import { cn } from "@/lib/css";
import { SubscriptionType } from "@/lib/subscription/enum";
import { Subscription } from "@/models/subscription";
import { usePocketClient } from "@/provider/PocketBase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const getSubscriptionHref = (
  readonlyParams: ReadonlyURLSearchParams,
  type: SubscriptionType
) => {
  const params = new URLSearchParams(readonlyParams);
  params.set("type", type);

  return `/subscriptions?${params}`;
};

export default function Page() {
  const client = usePocketClient();
  const params = useSearchParams();
  const type = params.get("type") as SubscriptionType | null;
  const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["SUBSCRIPTIONS", type] as const,
      queryFn: async ({ queryKey, pageParam }) => {
        const [, type] = queryKey;
        const subs = await client
          .collection("subscriptions")
          .getList<Subscription<true>>(pageParam, 10, {
            expand: "user",
            filter: `type = \"${type ?? SubscriptionType.MONTH}\"`,
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
    <div className="flex flex-col w-full gap-y-4 flex-1">
      <div className="flex flex-col w-full">
        <div className="w-full flex items-center h-[60px] justify-between gap-x-4 px-4">
          <Link href={"/"}>
            <ChevronLeftIcon />
          </Link>
          <h2 className="whitespace-nowrap flex-shrink-0 font-semibold">
            Subscriptions
          </h2>
          <div className="w-full flex items-center justify-end gap-x-4"></div>
        </div>
        <div className="w-full flex items-center">
          <Link
            href={getSubscriptionHref(params, SubscriptionType.MONTH)}
            className={cn(
              "w-full p-2 text-center font-medium",
              (type === SubscriptionType.MONTH || type === null) &&
                "border-b-2 border-slate-500"
            )}
          >
            Month
          </Link>
          <Link
            href={getSubscriptionHref(params, SubscriptionType.WEEK)}
            className={cn(
              "w-full p-2 text-center font-medium",
              type === SubscriptionType.WEEK && "border-b-2 border-slate-500"
            )}
          >
            Week
          </Link>
        </div>
      </div>
      <div className="flex flex-col w-full flex-1 p-4 justify-between">
        <div className="flex flex-col w-full divide-y">
          <Suspense>
            {(type === SubscriptionType.MONTH || type === null) &&
              subs?.map((sub) => {
                return <SubscriptionItem.Month sub={sub} key={sub.id} />;
              })}
          </Suspense>
          <Suspense>
            {type === SubscriptionType.WEEK &&
              subs?.map((sub) => {
                return <SubscriptionItem.Week sub={sub} key={sub.id} />;
              })}
          </Suspense>
        </div>
        <div className="h-px w-full" ref={ref} />
      </div>
    </div>
  );
}

export const runtime = "edge";
