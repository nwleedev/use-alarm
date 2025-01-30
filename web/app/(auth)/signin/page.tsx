"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSchemaLibs, SignInProps } from "@/lib/auth/schema";
import { usePocketClient } from "@/provider/PocketBase";
import { zodResolver } from "@hookform/resolvers/zod";
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

    const exportedCookie = client.authStore.exportToCookie({ httpOnly: false });
    document.cookie = exportedCookie;

    await client.collection("users").authRefresh();
    router.push("/");
  });
  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex flex-col flex-1 w-full justify-center">
        <div className="flex justify-center">
          <img
            src="/static/icon-192.png"
            alt="Use Alarm icon"
            className="w-20 h-20"
          />
        </div>
        <form
          method="POST"
          onSubmit={onSubmit}
          className="flex flex-col w-full gap-y-4 p-4"
        >
          <div className="flex flex-col w-full gap-y-2">
            <Label>Your email</Label>
            <Input type="email" {...register("email")} />
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <Label>Your password</Label>
            <Input type="password" {...register("password")} />
          </div>
          <Button type="submit">Sign In</Button>
        </form>
        <div className="flex w-full items-center p-4">
          <Link
            href={"/signup"}
            className="text-sm text-blue-500 border-b border-blue-500 font-normal"
          >
            Create a new account
          </Link>
        </div>
      </div>
    </div>
  );
}
