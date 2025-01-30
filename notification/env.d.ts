export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: string;
      VAPID_PRIVATE_KEY: string;
      ADMIN_EMAIL: string;
      ADMIN_API_KEY: string;
    }
  }
}
