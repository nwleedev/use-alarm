"use client";

import { Button } from "@/components/ui/button";
import { usePocketClient } from "@/provider/PocketBase";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { action } from "./action";

export default function Page() {
  const client = usePocketClient();
  const { data: auths } = useQuery({
    queryKey: ["OAUTH2_METHODS"],
    queryFn: () => client.collection("users").listAuthMethods(),
  });

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
            <h1 className="text-2xl font-bold text-[#0D062D]">Welcome</h1>
            <p className="text-[#787486] mt-2">Sign in to continue</p>
          </div>

          <div className="w-full flex items-center justify-center gap-y-1">
            {auths?.oauth2.providers.map((provider) => {
              return (
                <Button
                  className="text-[#5030E5] hover:text-[#4024B8] transition-colors font-medium bg-white"
                  // href={href}
                  key={provider.name}
                  onClick={() => action(provider)}
                >
                  Sign in with {provider.displayName}
                </Button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const runtime = "edge";
