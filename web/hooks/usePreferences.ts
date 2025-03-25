import { getLocalCurrency } from "@/lib/currency";
import { getLocalTimezone } from "@/lib/timezone";
import { Preferences } from "@/models/preferences";
import { usePocketClient } from "@/provider/PocketBase";
import { useQuery } from "@tanstack/react-query";

export function usePreferences() {
  const client = usePocketClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["USER_PREFERENCES"],
    queryFn: async () => {
      try {
        return await client
          .collection("preferences")
          .getFirstListItem<Preferences>(
            `user="${client.authStore.record?.id}"`
          );
      } catch (error) {
        // If no preferences exist, create one with defaults
        return await client.collection("preferences").create<Preferences>({
          user: client.authStore.record?.id,
          timezone: getLocalTimezone(),
          timezoneOffset: new Date().getTimezoneOffset(),
          hour: 9,
          currency: getLocalCurrency(),
        });
      }
    },
  });

  return {
    preferences,
    isLoading,
    timezone: preferences?.timezone || getLocalTimezone(),
    currency: preferences?.currency || getLocalCurrency(),
  };
}
