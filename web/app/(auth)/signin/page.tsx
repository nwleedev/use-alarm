"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSchemaLibs, SignInProps } from "@/lib/auth/schema";
import { usePocketClient } from "@/provider/PocketBase";
import { zodResolver } from "@hookform/resolvers/zod";
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
    document.cookie += `;${exportedCookie};`;
    router.push("/");
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
            <Label>Your password</Label>
            <Input type="password" {...register("password")} />
          </div>
          <Button type="submit">Sign In</Button>
        </form>
      </div>
    </div>
  );
}
