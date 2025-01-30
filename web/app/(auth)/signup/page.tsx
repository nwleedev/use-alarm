"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSchemaLibs, SignUpProps } from "@/lib/auth/schema";
import { usePocketClient } from "@/provider/PocketBase";
import { zodResolver } from "@hookform/resolvers/zod";
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
    <div className="flex w-full flex-col flex-1">
      <div className="flex flex-col w-full flex-1 justify-center">
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
          <div className="flex flex-col gap-y-2 w-full">
            <Label>Your email</Label>
            <Input type="email" {...register("email")} />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <Label>Your name</Label>
            <Input type="text" {...register("name")} />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <Label>Your password</Label>
            <Input type="password" {...register("password")} />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <Label>Password confirm</Label>
            <Input type="password" {...register("passwordConfirm")} />
          </div>
          <Button type="submit">Sign Up</Button>
        </form>
        <div className="flex w-full items-center p-4">
          <Link
            href={"/signin"}
            className="text-sm text-blue-500 border-b border-blue-500 font-normal"
          >
            Sign in with the existing account
          </Link>
        </div>
      </div>
    </div>
  );
}
