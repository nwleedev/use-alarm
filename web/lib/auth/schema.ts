import zod from "zod";

class AuthSchemaLibs {
  static signIn = zod.object({
    email: zod.string().email().trim(),
    password: zod.string().min(8).trim(),
  });
  static signUp = zod
    .object({
      email: zod.string().email().trim(),
      name: zod.string().min(2).trim(),
      password: zod.string().min(8).trim(),
      passwordConfirm: zod.string().min(8).trim(),
    })
    .refine((form) => form.password === form.passwordConfirm, {
      path: ["passwordConfirm"],
      message: "Passwords do not match.",
    });
}

export { AuthSchemaLibs };
export type SignInProps = zod.infer<typeof AuthSchemaLibs.signIn>;
export type SignUpProps = zod.infer<typeof AuthSchemaLibs.signUp>;
