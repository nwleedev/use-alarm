"use client";

import AccountNotification from "@/components/Notification";
import { User } from "@/models/user";
import { usePocketClient } from "@/provider/PocketBase";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const client = usePocketClient();
  const { data: user } = useQuery({
    queryKey: ["USER"],
    queryFn: () => {
      return client.authStore.record as unknown as User;
    },
  });

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex items-center h-[60px] gap-x-4 px-2 shadow-sm">
        <Link href={"/"}>
          <ChevronLeft />
        </Link>
        <h2 className="text-xl font-semibold whitespace-nowrap flex-shrink-0">
          Account
        </h2>
      </div>
      {user && (
        <div className="flex flex-col w-full gap-y-4 p-4">
          <div className="w-full max-w-[480px] flex flex-col gap-y-4">
            <h1 className="text-base font-normal">Hi, {user.name}.</h1>
          </div>
          <div className="w-full flex flex-col gap-y-2">
            <h2 className="text-xl font-semibold">Settings</h2>
            <AccountNotification />
          </div>
        </div>
      )}
    </div>
  );
}

export const runtime = "edge";
