import PocketBase from "pocketbase";

let browserPocketClient: PocketBase | null = null;

export class PocketBaseLibs {
  static createClient(baseURL: string) {
    return new PocketBase(baseURL);
  }

  static getClient() {
    const isServer = typeof window === "undefined" || "Deno" in globalThis;

    if (isServer) {
      return PocketBaseLibs.createClient(process.env.NEXT_PUBLIC_API_URL);
    }

    if (!browserPocketClient) {
      browserPocketClient = PocketBaseLibs.createClient(
        process.env.NEXT_PUBLIC_API_URL
      );
    }

    return browserPocketClient;
  }
}

export default PocketBaseLibs;
