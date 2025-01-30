"use server";

import { AuthSchemaLibs, SignUpProps } from "@/lib/auth/schema";
import { PocketBaseLibs } from "@/lib/pocket-base";

export async function action(formData: SignUpProps) {
  const parsed = AuthSchemaLibs.signUp.parse(formData);

  const client = PocketBaseLibs.getClient();
  const { email, password, name, passwordConfirm } = parsed;
  const model = await client
    .collection("users")
    .create({ email, password, name, passwordConfirm });

  return {
    message: "User created",
    id: model.id,
  };
}
