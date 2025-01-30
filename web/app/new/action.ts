"use server";

import PocketBaseLibs from "@/lib/pocket-base";
import {
  NewSubscriptionProps,
  SubscriptionSchemaLibs,
} from "@/lib/subscription/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function action(props: NewSubscriptionProps) {
  const client = PocketBaseLibs.getClient();
  const form = SubscriptionSchemaLibs.new.parse(props);
  client.authStore.loadFromCookie(cookies().toString());

  if (!client.authStore.isValid) {
    throw new Error("Not authenticated.");
  }

  const user = client.authStore.record;

  await client.collection("subscriptions").create({ ...form, user: user?.id });

  redirect("/");
}
