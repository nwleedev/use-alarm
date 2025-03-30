"use server";

import * as PocketBaseLibs from "@/lib/pocket-base";
import { addMinutes } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthProviderInfo } from "pocketbase";

function getOauth2RedirectURL(providerName: string) {
  switch (providerName) {
    case "google":
      return process.env.OAUTH2_REDIRECT_GOOGLE;
    case "github":
      return process.env.OAUTH2_REDIRECT_GITHUB;
  }
  return null;
}

export async function action(providerInfo: AuthProviderInfo) {
  const client = PocketBaseLibs.getClient();
  const auths = await client.collection("users").listAuthMethods();
  const provider = auths.oauth2.providers.find(
    (auth) => auth.name === providerInfo.name
  );
  const redirectURL = getOauth2RedirectURL(providerInfo.name);
  if (!provider || !redirectURL) {
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

  const redirectUrl = provider.authURL + redirectURL;
  redirect(redirectUrl);
}
