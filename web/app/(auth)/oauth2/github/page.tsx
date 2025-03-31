"use client";

import { usePocketClient } from "@/provider/PocketBase";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { action } from "./action";

export default function Page() {
  const client = usePocketClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function onAuth() {
      await action(searchParams.toString());
      client.authStore.loadFromCookie(document.cookie);
      await client.collection("users").authRefresh();
      router.push("/home");
    }
    onAuth();
  }, [client, router, searchParams]);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/static/icon-192.png"
              alt="Use Alarm icon"
              className="w-16 h-16 mb-4"
            />
            <h1 className="text-2xl font-bold text-[#0D062D]">Processing...</h1>
            <p className="text-[#787486] mt-2">Please wait for seconds.</p>
          </div>

          <div className="w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5030E5]"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const runtime = "edge";
