"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSchemaLibs, SignUpProps } from "@/lib/auth/schema";
import { usePocketClient } from "@/provider/PocketBase";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const { register, formState, handleSubmit } = useForm<SignUpProps>({
    resolver: zodResolver(AuthSchemaLibs.signUp),
  });
  const client = usePocketClient();
  const onSubmit = handleSubmit(async (form) => {
    const { email, password, name, passwordConfirm } = form;
    const model = await client
      .collection("users")
      .create({ email, password, name, passwordConfirm });

    router.push("/signin");
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
            <h1 className="text-2xl font-bold text-[#0D062D]">
              Create Account
            </h1>
            <p className="text-[#787486] mt-2">Sign up to get started</p>
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
              <Label className="text-[#0D062D] font-medium">Name</Label>
              <Input
                type="text"
                {...register("name")}
                className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]"
                placeholder="Enter your name"
              />
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

            <div className="flex flex-col gap-y-2">
              <Label className="text-[#0D062D] font-medium">
                Confirm Password
              </Label>
              <Input
                type="password"
                {...register("passwordConfirm")}
                className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]"
                placeholder="Confirm your password"
              />
              {formState.errors.passwordConfirm && (
                <p className="text-red-500 text-sm mt-1">
                  {formState.errors.passwordConfirm.message}
                </p>
              )}
            </div>

            <p className="text-sm text-[#787486]">
              Password must be at least 8 characters long
            </p>

            <Button
              type="submit"
              className="w-full bg-[#5030E5] hover:bg-[#4024B8] transition-colors mt-4"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/signin"
              className="text-[#5030E5] hover:text-[#4024B8] transition-colors font-medium"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const runtime = "edge";
