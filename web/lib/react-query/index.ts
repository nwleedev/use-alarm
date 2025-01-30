import { isServer, QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | null = null;

class ReactQueryLibs {
  static createClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60,
        },
      },
    });
  }

  static getClient() {
    if (isServer) {
      return ReactQueryLibs.createClient();
    }
    if (!browserQueryClient) {
      browserQueryClient = ReactQueryLibs.createClient();
    }
    return browserQueryClient;
  }
}

export default ReactQueryLibs;
