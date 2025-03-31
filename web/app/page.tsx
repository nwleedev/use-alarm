"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bell, Calendar, Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F5] flex-col">
      {/* Header */}
      <div className="w-full flex items-center h-[70px] justify-between px-6 bg-white shadow-sm sticky top-0">
        <div className="flex items-center gap-x-4">
          <h2 className="text-xl font-bold text-[#0D062D]">Use Alarm</h2>
        </div>
        <Link href="/join">
          <Button className="bg-[#5030E5] hover:bg-[#4024B8] transition-colors">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-[#0D062D] mb-4">
              Never Miss a Subscription Payment
            </h1>
            <p className="text-xl text-[#787486]">
              Manage your subscriptions and get timely notifications before
              payments
            </p>
          </div>

          {/* Features Grid */}
          <div className="flex flex-col gap-y-6">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-[#5030E510] rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-[#5030E5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0D062D] mb-2">
                Easy Subscription Management
              </h3>
              <p className="text-[#787486]">
                Register and manage all your subscriptions in one place. Track
                payment dates and amounts effortlessly.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-[#5030E510] rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-[#5030E5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0D062D] mb-2">
                Smart Notifications
              </h3>
              <p className="text-[#787486]">
                Receive timely notifications before your subscription payments
                are due. Stay on top of your expenses.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-[#5030E510] rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-[#5030E5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0D062D] mb-2">
                Flexible Reminder Settings
              </h3>
              <p className="text-[#787486]">
                Customize when you want to receive notifications. Set reminders
                for weekly, or monthly subscriptions.
              </p>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-bold text-[#0D062D] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[#787486] mb-6">
              Join Use Alarm today and take control of your subscriptions
            </p>
            <Link href="/join">
              <Button className="bg-[#5030E5] hover:bg-[#4024B8] transition-colors px-8">
                Sign Up Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export const runtime = "edge";
