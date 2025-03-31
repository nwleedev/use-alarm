"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { usePreferences } from "@/hooks/usePreferences";
import { formatAmount } from "@/lib/currency";
import { DateLibs } from "@/lib/date";
import { SubscriptionType } from "@/lib/subscription/enum";
import { Subscription } from "@/models/subscription";
import { usePocketClient } from "@/provider/PocketBase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Edit3,
  Folder,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subscriptionName: string;
  isPending: boolean;
}

interface MoreActionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  subscriptionId: string;
}

function MoreActionsSheet({
  isOpen,
  onClose,
  onDelete,
  subscriptionId,
}: MoreActionsSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Actions">
      <div className="space-y-4">
        <Link
          href={`/subscription/${subscriptionId}/edit`}
          className="flex items-center gap-3 px-4 py-3 text-[#787486] hover:bg-[#5030E510] rounded-lg transition-colors"
        >
          <Edit3 className="w-5 h-5" />
          <span>Edit Subscription</span>
        </Link>
        <button
          onClick={onDelete}
          className="flex items-center gap-3 px-4 py-3 text-[#D8727D] hover:bg-[#D8727D10] rounded-lg transition-colors w-full"
        >
          <Trash2 className="w-5 h-5" />
          <span>Delete Subscription</span>
        </button>
      </div>
    </BottomSheet>
  );
}

function DeleteSheet({
  isOpen,
  onClose,
  onConfirm,
  subscriptionName,
  isPending,
}: DeleteSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Delete Subscription">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-[#0D062D] font-semibold">
            Delete {subscriptionName}
          </h3>
          <p className="text-[#787486]">
            Are you sure you want to delete this subscription? This action
            cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#787486] text-[#787486] rounded-lg hover:border-[#5030E5] hover:text-[#5030E5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-3 bg-[#D8727D] text-white rounded-lg hover:bg-[#c4666f] transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

const statusColors = {
  Active: {
    bg: "bg-[#83C29D33]",
    text: "text-[#68B266]",
  },
  Pending: {
    bg: "bg-[#DFA87433]",
    text: "text-[#D58D49]",
  },
  Cancelled: {
    bg: "bg-[#D8727D1A]",
    text: "text-[#D8727D]",
  },
} as const;

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const client = usePocketClient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  const { preferences } = usePreferences();

  const { data, isLoading } = useQuery({
    queryKey: ["SUBSCRIPTION", id] as const,
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const sub = (await client
        .collection("subscriptions")
        .getOne(id, { expand: "category" })) as Subscription;
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
      router.push("/subscriptions");
    },
  });

  if (isLoading || !data || !preferences) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-[#787486]">Loading...</div>
      </div>
    );
  }
  const amount = formatAmount(data?.amount, preferences.currency);

  const status = (data.status || "Active") as keyof typeof statusColors;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 -ml-2 hover:bg-[#F5F5F5] rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-[#0D062D]" />
              </button>
              <h1 className="text-[#0D062D] text-lg font-semibold">Details</h1>
            </div>
            <button
              onClick={() => setIsMoreActionsOpen(true)}
              className="p-2 -mr-2 hover:bg-[#F5F5F5] rounded-full transition-colors"
            >
              <MoreVertical className="w-6 h-6 text-[#0D062D]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          {/* Subscription Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="text-4xl">{data.icon || "📦"}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-[#0D062D] text-xl font-semibold">
                  {data.name}
                </h2>
                <div
                  className={`px-4 py-1 rounded-md ${statusColors[status].bg} ${statusColors[status].text}`}
                >
                  {status}
                </div>
              </div>
              <p className="text-[#787486] mt-2 text-sm">{data.description}</p>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="grid grid-cols-1 gap-8">
            {/* Payment Details */}
            <div className="space-y-6">
              <h3 className="text-[#0D062D] text-lg font-semibold">
                Payment Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[#787486]">
                  <CreditCard className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Amount</p>
                    <p className="text-[#0D062D] font-medium">{amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#787486]">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Billing Cycle</p>
                    <p className="text-[#0D062D] font-medium">
                      {data.type === SubscriptionType.MONTH ? "Month" : "Week"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#787486]">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="text-sm">
                      {data.type === SubscriptionType.MONTH
                        ? "Payment Date"
                        : "Payment Day"}
                    </p>
                    <p className="text-[#0D062D] font-medium">
                      {data.type === SubscriptionType.MONTH
                        ? DateLibs.formatDate(data.payment)
                        : DateLibs.formatDay(data.payment, "EEEE")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#787486]">
                  <Folder className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Category</p>
                    <p className="text-[#0D062D] font-medium">
                      {data.expand?.category?.name || "Common"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-6">
              <h3 className="text-[#0D062D] text-lg font-semibold">
                Notification Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[#787486]">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-sm">
                      {data.type === SubscriptionType.MONTH
                        ? "Reminder Before"
                        : "Reminder Day"}
                    </p>
                    <p className="text-[#0D062D] font-medium">
                      {data.type === SubscriptionType.MONTH
                        ? data.alarm === 1
                          ? "1 day before"
                          : `${data.alarm} days before`
                        : DateLibs.formatDay(data.alarm, "EEEE")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <DeleteSheet
        isOpen={isDeleteSheetOpen}
        onClose={() => setIsDeleteSheetOpen(false)}
        onConfirm={() => {
          mutateAsync({
            id: data.id,
            type: data.type as SubscriptionType,
          });
        }}
        subscriptionName={data.name}
        isPending={isPending}
      />

      <MoreActionsSheet
        isOpen={isMoreActionsOpen}
        onClose={() => setIsMoreActionsOpen(false)}
        onDelete={() => {
          setIsMoreActionsOpen(false);
          setIsDeleteSheetOpen(true);
        }}
        subscriptionId={data.id}
      />
    </div>
  );
}

export const runtime = "edge";
