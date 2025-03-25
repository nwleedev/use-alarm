"use client";

import CurrencySelect from "@/components/CurrencySelect";
import TimeSelect from "@/components/TimeSelect";
import TimezoneSelect from "@/components/TimezoneSelect";
import { getLocalCurrency } from "@/lib/currency";
import { getLocalTimezone } from "@/lib/timezone";
import { Preferences } from "@/models/preferences";
import { usePocketClient } from "@/provider/PocketBase";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const client = usePocketClient();
  const queryClient = useQueryClient();

  const { data: preferences } = useSuspenseQuery({
    queryKey: ["USER_PREFERENCES"],
    queryFn: async () => {
      try {
        const record = await client
          .collection("preferences")
          .getFirstListItem<Preferences>(
            `user="${client.authStore.record?.id}"`
          );
        return {
          id: record.id,
          timezone: record.timezone,
          timezoneOffset: record.timezoneOffset,
          currency: record.currency,
          hour: record.hour,
        };
      } catch (error) {
        // If no preferences exist, create one with defaults
        const record = await client
          .collection("preferences")
          .create<Preferences>({
            user: client.authStore.record?.id,
            timezone: getLocalTimezone(),
            timezoneOffset: new Date().getTimezoneOffset(),
            currency: getLocalCurrency(),
            hour: 9,
          });
        return record;
      }
    },
  });

  const { mutateAsync: updatePreferences, isPending } = useMutation({
    mutationFn: async ({
      timezone,
      currency,
      hour,
    }: {
      timezone?: string;
      currency?: string;
      hour?: number;
    }) => {
      if (!preferences || !preferences.id) return;

      const updates: Partial<Preferences> = {};

      if (timezone) {
        const date = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          timeZoneName: "longOffset",
        });
        const parts = formatter.formatToParts(date);
        const timeZonePart = parts.find((part) => part.type === "timeZoneName");
        const offset = timeZonePart?.value || "";

        // Convert offset string (e.g., "GMT-04:00") to minutes
        const match = offset.match(/GMT([+-])(\d{2}):(\d{2})/);
        const offsetMinutes = match
          ? (match[1] === "-" ? 1 : -1) *
            (parseInt(match[2]) * 60 + parseInt(match[3]))
          : 0;

        updates.timezone = timezone;
        updates.timezoneOffset = offsetMinutes;
      }

      if (currency) {
        updates.currency = currency;
      }

      if (typeof hour === "number") {
        updates.hour = hour;
      }

      await client.collection("preferences").update(preferences.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["USER_PREFERENCES"] });
    },
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center gap-x-2">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-[#F5F5F5] rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#0D062D]" />
            </button>
            <h1 className="text-[#0D062D] text-lg font-semibold">
              Preferences
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-[#0D062D] font-semibold">Timezone</h3>
            <p className="text-[#787486] text-sm">
              Select your timezone to receive notifications at the right time
            </p>
            <div className="pt-2">
              <TimezoneSelect
                value={preferences.timezone}
                onSelect={(value) => {
                  updatePreferences({ timezone: value });
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[#0D062D] font-semibold">Notification Time</h3>
            <p className="text-[#787486] text-sm">
              Choose when you want to receive daily notifications
            </p>
            <div className="pt-2">
              <TimeSelect
                value={preferences.hour}
                onSelect={(value) => {
                  updatePreferences({ hour: value });
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[#0D062D] font-semibold">Currency</h3>
            <p className="text-[#787486] text-sm">
              Choose your preferred currency for subscription amounts
            </p>
            <div className="pt-2">
              <CurrencySelect
                value={preferences.currency}
                onSelect={(value) => {
                  updatePreferences({ currency: value });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
