import PocketBase from "pocketbase";

let browserPocketClient: PocketBase | null = null;

export function createClient(baseURL: string) {
  return new PocketBase(baseURL);
}

export function getClient() {
  const isServer = typeof window === "undefined" || "Deno" in globalThis;

  if (isServer) {
    return createClient(process.env.NEXT_PUBLIC_API_URL);
  }

  if (!browserPocketClient) {
    browserPocketClient = createClient(process.env.NEXT_PUBLIC_API_URL);
  }

  return browserPocketClient;
}
