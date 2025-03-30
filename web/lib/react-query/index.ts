import { isServer, QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | null = null;

export function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
      },
    },
  });
}

export function getClient() {
  if (isServer) {
    return createClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = createClient();
  }
  return browserQueryClient;
}
