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
    <div className="flex flex-col w-full gap-y-4">
      {/* <Button onClick={() => subscribe()}>Subscribe</Button> */}
      <div className="flex items-center justify-between gap-x-2">
        <h3 className="font-normal text-base">Web Push</h3>
        <Switch
          checked={!!subscription}
          onCheckedChange={onCheckedChange}
          disabled={!isSupported || isPending}
        />
      </div>
    </div>
  );
};

export default AccountNotification;
