"use client";

import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DateLibs } from "@/lib/date";
import { SubscriptionType } from "@/lib/subscription/enum";
import { Subscription } from "@/models/subscription";
import { usePocketClient } from "@/provider/PocketBase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const client = usePocketClient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["SUBSCRIPTION", id] as const,
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;

      const sub = (await client
        .collection("subscriptions")
        .getOne(id)) as Subscription;

      return sub;
    },
  });
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["SUBSCRIPTION_DELETE"],
    mutationFn: async (args: { id: string; type: SubscriptionType }) => {
      await client.collection("subscriptions").delete(args.id);

      return { id };
    },
    onSuccess: (...args) => {
      const [, vars] = args;
      if (vars.type === SubscriptionType.MONTH) {
        queryClient.refetchQueries({ queryKey: ["SUBSCRIPTION_MONTH"] });
      } else {
        queryClient.refetchQueries({ queryKey: ["SUBSCRIPTION_WEEK"] });
      }
      router.push("/");
    },
  });
  return (
    <div className="flex flex-col w-full relative flex-1">
      <div className="bg-slate-50 w-full flex items-center h-[60px] justify-between gap-x-4 px-4 shadow-sm sticky top-0 left-0 right-0">
        <div className="flex items-center gap-x-2">
          <Link href={"/"}>
            <ChevronLeftIcon />
          </Link>
          <h2 className="font-semibold whitespace-nowrap flex-shrink-0">
            Detail
          </h2>
        </div>
      </div>
      {data && (
        <div className="w-full flex flex-col p-4 px-6 gap-y-4 flex-1">
          {data.icon && <p className="text-6xl">{data.icon}</p>}
          <div className="w-full flex items-center justify-between gap-x-2">
            <div className="flex flex-col w-full gap-y-1.5">
              <h1 className="text-3xl font-semibold">{data.name}</h1>
              <p className="font-normal text-gray-500">{data.description}</p>
            </div>
            <div className="flex items-center">
              <p className="text-2xl font-semibold">{data.amount}</p>
            </div>
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <h2 className="text-xl font-semibold">Attributes</h2>
            <div className="flex flex-col w-full divide-y">
              <div className="w-full flex items-center justify-between gap-x-2 py-4">
                <h3 className="font-medium">Type</h3>
                <p className="text-gray-600 font-normal">
                  {data.type === SubscriptionType.MONTH ? "Monthly" : "Weekly"}
                </p>
              </div>
              <div className="w-full flex items-center justify-between gap-x-2 py-4">
                <h3 className="font-medium">Price</h3>
                <p className="text-gray-600 font-normal">{data.amount}</p>
              </div>
              <div className="w-full flex items-center justify-between gap-x-2 py-4">
                {data.type === SubscriptionType.MONTH && (
                  <h3 className="font-medium">Payment date</h3>
                )}
                {data.type === SubscriptionType.WEEK && (
                  <h3 className="font-medium">Payment day</h3>
                )}
                <p className="text-gray-600 font-normal">
                  {data.type === SubscriptionType.MONTH
                    ? DateLibs.formatDate(data.payment)
                    : DateLibs.formatDay(data.payment, "EEEE")}
                </p>
              </div>
              {data.type === SubscriptionType.MONTH && (
                <div className="w-full flex items-center justify-between gap-x-2 py-4">
                  <h3 className="font-medium">Alarm before days</h3>
                  <p className="text-gray-600 font-normal">
                    {data.alarm === 1 && `${data.alarm} day`}
                    {data.alarm !== 1 && `${data.alarm} days`}
                  </p>
                </div>
              )}
              {data.type === SubscriptionType.WEEK && (
                <div className="w-full flex items-center justify-between gap-x-2 py-4">
                  <h3 className="font-medium">Alarm day</h3>
                  <p className="text-gray-600 font-normal">
                    {DateLibs.formatDay(data.alarm, "EEEE")}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex items-center gap-x-2 mt-auto">
            <Link href={`/subscription/${data.id}/edit`} className="w-full">
              <Button className="w-full bg-white text-red-500">Edit</Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full text-white bg-red-500">Delete</Button>
              </DialogTrigger>
              <DialogContent className="w-11/12 sm:w-full">
                <DialogTitle>Delete {data.name}</DialogTitle>
                <DialogDescription>
                  Do you want to delete this subscription?
                </DialogDescription>
                <DialogFooter className="flex gap-x-2 flex-row">
                  <DialogClose asChild>
                    <Button className="w-full bg-white text-red-500">
                      Cancel
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className="w-full text-white bg-red-500"
                      disabled={isPending}
                      onClick={() => {
                        mutateAsync({
                          id: data.id,
                          type: data.type as SubscriptionType,
                        });
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
      <BottomNavigation />
    </div>
  );
}

export const runtime = "edge";
