"use client";

import useNotification from "@/hooks/useNotification";
import { Switch } from "../ui/switch";

const AccountNotification = () => {
  const { isSupported, isPending, subscribe, subscription, unsubscribe } =
    useNotification();

  const onCheckedChange = (value: boolean) => {
    if (value) {
      subscribe();
    } else {
      unsubscribe();
    }
  };

  return (
    <Switch
      checked={!!subscription}
      onCheckedChange={onCheckedChange}
      disabled={!isSupported || isPending}
    />
  );
};

export default AccountNotification;
