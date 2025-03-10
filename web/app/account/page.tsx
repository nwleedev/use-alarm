"use client";

import BottomNavigation from "@/components/BottomNavigation";
import AccountNotification from "@/components/Notification";
import { Button } from "@/components/ui/button";
import { User } from "@/models/user";
import { usePocketClient } from "@/provider/PocketBase";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Page() {
  const client = usePocketClient();
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["USER"],
    queryFn: () => {
      return client.authStore.record as unknown as User;
    },
  });
  const onSignOut = async () => {
    const expires = new Date();
    const exportedCookie = client.authStore.exportToCookie({
      httpOnly: false,
      expires,
    });
    document.cookie = exportedCookie;
    await client.collection("users").authRefresh();
    router.push("/signin");
  };

  return (
    <div className="flex flex-col w-full flex-1">
      <div className="w-full flex items-center h-[60px] gap-x-4 px-4 shadow-sm">
        <h2 className="font-semibold whitespace-nowrap flex-shrink-0">
          Account
        </h2>
      </div>
      <div className="flex flex-col w-full gap-y-4 p-4 flex-1">
        {user && (
          <>
            <div className="w-full max-w-[480px] flex flex-col gap-y-4">
              <h1 className="text-base font-normal">Hi, {user.name}.</h1>
            </div>
            <div className="w-full flex flex-col gap-y-2">
              <h2 className="text-xl font-semibold">Settings</h2>
              <AccountNotification />
            </div>
            <div>
              <Button
                className="flex bg-red-600 hover:bg-red-400 font-semibold border-b text-white"
                onClick={onSignOut}
              >
                Sign Out
              </Button>
            </div>
          </>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
}

export const runtime = "edge";
