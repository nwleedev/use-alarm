"use server";

import * as PocketBaseLibs from "@/lib/pocket-base";
import { addMinutes } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthProviderInfo } from "pocketbase";

export async function action(providerInfo: AuthProviderInfo) {
  const client = PocketBaseLibs.getClient();
  const auths = await client.collection("users").listAuthMethods();
  const provider = auths.oauth2.providers.find(
    (auth) => auth.name === providerInfo.name
  );
  if (!provider) {
    return {};
  }
  const cookie = btoa(JSON.stringify(provider));
  const expires = addMinutes(new Date(), 5);
  cookies().set("provider", cookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });

  const redirectUrl = provider.authURL + process.env.OAUTH2_REDIRECT_GOOGLE;
  redirect(redirectUrl);
}
