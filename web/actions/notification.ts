"use server";

import PocketBaseLibs from "@/lib/pocket-base";
import { cookies } from "next/headers";

export const action = async (subscription: PushSubscriptionJSON) => {
  const client = PocketBaseLibs.getClient();
  client.authStore.loadFromCookie(cookies().toString());

  if (!client.authStore.isValid) {
    return { message: "You are not authenticated." };
  }

  const user = client.authStore.record;

  await client.collection("notifications").create({
    endpoint: subscription.endpoint,
    keys: subscription.keys,
    user: user?.id,
  });
  return {};
};
