"use client";

import { action } from "@/actions/notification";
import { Base64Libs } from "@/lib/base64";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

export interface NotificationState {
  subscription: PushSubscription | null;
  isSupported: boolean;
  isPending: boolean;
  subscribe: () => unknown;
  unsubscribe: () => unknown;
}

export const NotificationContext = createContext<NotificationState>(null!);

const NotificationProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [isSupported, setIsSupported] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  const register = useCallback(async () => {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      register();
    }
  }, [register]);

  const subscribe = useCallback(async () => {
    setIsPending(true);
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: Base64Libs.toUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    const serializedSub: PushSubscriptionJSON = JSON.parse(JSON.stringify(sub));
    await action(serializedSub);
    setSubscription(sub);
    setIsPending(false);
  }, []);

  const unsubscribe = useCallback(async () => {
    setIsPending(true);
    if (subscription) {
      await subscription?.unsubscribe();
    }
    setSubscription(null);
    setIsPending(false);
  }, [subscription]);

  return (
    <NotificationContext.Provider
      value={{
        subscription,
        isPending,
        isSupported,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
