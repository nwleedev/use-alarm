"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSchemaLibs, SignUpProps } from "@/lib/auth/schema";
import { usePocketClient } from "@/provider/PocketBase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Page() {
  const { register, formState, handleSubmit } = useForm<SignUpProps>({
    resolver: zodResolver(AuthSchemaLibs.signUp),
  });
  const client = usePocketClient();
  const onSubmit = handleSubmit(async (form) => {
    const { email, password, name, passwordConfirm } = form;
    const model = await client
      .collection("users")
      .create({ email, password, name, passwordConfirm });
  });
  return (
    <div>
      <div className="flex flex-col w-full">
        <form method="POST" onSubmit={onSubmit}>
          <div className="">
            <Label>Your email</Label>
            <Input type="email" {...register("email")} />
          </div>
          <div className="">
            <Label>Your name</Label>
            <Input type="text" {...register("name")} />
          </div>
          <div className="">
            <Label>Your password</Label>
            <Input type="password" {...register("password")} />
          </div>
          <div className="">
            <Label>Password confirm</Label>
            <Input type="password" {...register("passwordConfirm")} />
          </div>
          <Button type="submit">Sign In</Button>
        </form>
      </div>
    </div>
  );
}
