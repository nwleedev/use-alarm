"use server";

import * as PocketBaseLibs from "@/lib/pocket-base";
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
    return redirect("/join");
  }

  const user = client.authStore.record;

  const record = await client
    .collection("subscriptions")
    .create({ ...form, user: user?.id });

  redirect("/home");
}
