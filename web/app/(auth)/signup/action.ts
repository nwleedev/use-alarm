"use server";

import { AuthSchemaLibs, SignUpProps } from "@/lib/auth/schema";
import { getLocalCurrency } from "@/lib/currency";
import { PocketBaseLibs } from "@/lib/pocket-base";
import { getLocalTimezone } from "@/lib/timezone";

export async function action(formData: SignUpProps) {
  const parsed = AuthSchemaLibs.signUp.parse(formData);

  const client = PocketBaseLibs.getClient();
  const { email, password, name, passwordConfirm } = parsed;
  const model = await client
    .collection("users")
    .create({ email, password, name, passwordConfirm });
  const preference = await client.collection("preferences").create({
    user: model.id,
    timezone: getLocalTimezone(),
    timezoneOffset: new Date().getTimezoneOffset(),
    hour: 9,
    currency: getLocalCurrency(),
  });

  return {
    message: "User created",
    id: model.id,
  };
}
