import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isNotNil } from "ramda";
import { PocketBaseLibs } from "./lib/pocket-base";

export default async function middleware(request: NextRequest) {
  const client = PocketBaseLibs.getClient();
  const response = NextResponse.next();

  async function getIsAuthenticated() {
    client.authStore.loadFromCookie(cookies().toString());
    const user = client.authStore.record;

    return client.authStore.isValid && isNotNil(user) && isNotNil(user.id);
  }

  const isAuthenticated = await getIsAuthenticated();
  const isSignPage =
    request.url.includes("/signin") || request.url.includes("/signup");

  const origin = new URL(request.url);

  if (isSignPage && !isAuthenticated) {
    return response;
  }
  if (isSignPage && isAuthenticated) {
    const redirect = NextResponse.redirect(new URL("/", origin));
    return redirect;
  }
  if (!isSignPage && isAuthenticated) {
    return response;
  }
  if (!isSignPage && !isAuthenticated) {
    const redirect = NextResponse.redirect(new URL("/signin", origin));
    return redirect;
  }

  throw new Error("Failed to check auth status.");
}

export const config = {
  matcher: [
    "/((?!api|static|manifest.webmanifest|sw.js|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
