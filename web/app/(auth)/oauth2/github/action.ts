"use server";

import { getLocalCurrency } from "@/lib/currency";
import * as PocketBaseLibs from "@/lib/pocket-base";
import { getLocalTimezone } from "@/lib/timezone";
import { addDays } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthProviderInfo, ClientResponseError, cookieParse } from "pocketbase";

export async function action(searchParams: string | URLSearchParams) {
  const client = PocketBaseLibs.getClient();
  searchParams = new URLSearchParams(searchParams);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  function decodeProvider() {
    try {
      const provider: AuthProviderInfo = JSON.parse(
        atob(cookies().get("provider")!.value)
      );
      return provider;
    } catch (error) {
      return null;
    }
  }

  const provider = decodeProvider();

  if (!provider || provider.state !== state) {
    return redirect("/join");
  }
  await client
    .collection("users")
    .authWithOAuth2Code(
      provider.name,
      code!,
      provider.codeVerifier,
      process.env.OAUTH2_REDIRECT_GITHUB,
      {
        emailVisibility: false,
      }
    );
  try {
    await client.collection("preferences").create({
      user: client.authStore.record?.id,
      timezone: getLocalTimezone(),
      timezoneOffset: new Date().getTimezoneOffset(),
      hour: 9,
      currency: getLocalCurrency(),
    });
  } catch (error) {
    if (
      !(
        error instanceof ClientResponseError &&
        error.response.data.user.code === "validation_not_unique"
      )
    ) {
    }
  }
  const expires = addDays(new Date(), 7);
  const authCookie = client.authStore.exportToCookie({
    httpOnly: false,
    expires,
    sameSite: "strict",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  const authKey = "pb_auth";

  const payload = cookieParse(authCookie)[authKey];
  cookies().set(authKey, payload, {
    httpOnly: false,
    expires,
    sameSite: "strict",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return {};
}
