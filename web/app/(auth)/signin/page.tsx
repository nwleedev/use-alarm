"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSchemaLibs, SignInProps } from "@/lib/auth/schema";
import { usePocketClient } from "@/provider/PocketBase";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Page() {
  const { register, formState, handleSubmit } = useForm<SignInProps>({
    resolver: zodResolver(AuthSchemaLibs.signIn),
  });
  const router = useRouter();
  const client = usePocketClient();
  const onSubmit = handleSubmit(async (form) => {
    const response = await client
      .collection("users")
      .authWithPassword(form.email, form.password);

    const expires = addDays(new Date(), 7);
    const exportedCookie = client.authStore.exportToCookie({
      httpOnly: false,
      expires,
    });
    document.cookie = exportedCookie;

    await client.collection("users").authRefresh();
    router.push("/");
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
            <h1 className="text-2xl font-bold text-[#0D062D]">Welcome Back</h1>
            <p className="text-[#787486] mt-2">Sign in to continue</p>
          </div>

          <form
            method="POST"
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-y-6"
          >
            <div className="flex flex-col gap-y-2">
              <Label className="text-[#0D062D] font-medium">Email</Label>
              <Input
                type="email"
                {...register("email")}
                className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]"
                placeholder="Enter your email"
              />
              {formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <Label className="text-[#0D062D] font-medium">Password</Label>
              <Input
                type="password"
                {...register("password")}
                className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]"
                placeholder="Enter your password"
              />
              {formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#5030E5] hover:bg-[#4024B8] transition-colors mt-4"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/signup"
              className="text-[#5030E5] hover:text-[#4024B8] transition-colors font-medium"
            >
              {`Don't have an account? Sign up`}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const runtime = "edge";
