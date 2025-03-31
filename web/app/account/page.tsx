"use client";

import BottomNavigation from "@/components/BottomNavigation";
import AccountNotification from "@/components/Notification";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { User } from "@/models/user";
import { usePocketClient } from "@/provider/PocketBase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subMinutes } from "date-fns";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  HelpCircle,
  LogOut,
  Shield,
  Sliders,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignOutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

function SignOutSheet({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: SignOutSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Sign Out">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-[#787486]">
            Are you sure you want to sign out from your account?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#787486] text-[#787486] rounded-lg hover:border-[#5030E5] hover:text-[#5030E5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-[#D8727D] text-white rounded-lg hover:bg-[#c4666f] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

export default function Page() {
  const client = usePocketClient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isSignOutSheetOpen, setIsSignOutSheetOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["USER"],
    queryFn: () => {
      return client.authStore.record as unknown as User;
    },
  });

  const onSignOut = async () => {
    const expires = subMinutes(new Date(), 1);
    const exportedCookie = client.authStore.exportToCookie({
      httpOnly: false,
      expires,
    });
    document.cookie = exportedCookie;
    await client.collection("users").authRefresh();
    queryClient.clear();
    router.push("/join");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-[#787486]">Loading...</div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Privacy & Security",
      description: "Control your privacy settings",
      onClick: () => router.push("/account/privacy"),
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: "Help & Support",
      description: "Get help with your account",
      onClick: () => router.push("/account/help"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col flex-1">
      {/* Mobile Header */}
      <div className="sticky top-0 bottom-auto z-10 bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-[70px] flex items-center">
          <h2 className="text-[#0D062D] text-xl font-bold">Account</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] p-4 flex-1 flex flex-col">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#5030E5] flex items-center justify-center text-white text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-[#0D062D] text-xl font-semibold">
                {user.name}
              </h2>
              <p className="text-[#787486] text-sm">{user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="w-full flex items-center gap-4 p-4 hover:bg-[#5030E510] transition-colors border-b border-[#F5F5F5] last:border-b-0">
            <div className="text-[#787486]">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-[#0D062D] font-medium">Notification</h3>
              <p className="text-[#787486] text-sm">
                Toggle notifications for your account
              </p>
            </div>
            <AccountNotification />
          </div>
          <Link
            href={"/account/preferences"}
            className="w-full flex items-center gap-4 p-4 hover:bg-[#5030E510] transition-colors border-b border-[#F5F5F5] last:border-b-0"
          >
            <div className="text-[#787486]">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-[#0D062D] font-medium">Preferences</h3>
              <p className="text-[#787486] text-sm">
                Set your timezone and other preferences
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#787486]" />
          </Link>
        </motion.div>

        {/* Sign Out Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <button
            onClick={() => setIsSignOutSheetOpen(true)}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl hover:bg-[#D8727D10] text-[#D8727D] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </motion.div>
      </div>
      <div className="bg-white sticky bottom-0 top-auto">
        <BottomNavigation />
      </div>

      <SignOutSheet
        isOpen={isSignOutSheetOpen}
        onClose={() => setIsSignOutSheetOpen(false)}
        onConfirm={onSignOut}
        userName={user.name}
      />
    </div>
  );
}

export const runtime = "edge";
