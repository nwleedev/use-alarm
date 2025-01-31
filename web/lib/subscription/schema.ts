import zod from "zod";

class SubscriptionSchemaLibs {
  static new = zod.object({
    name: zod.string().max(127).trim(),
    description: zod.string().max(127).trim(),
    icon: zod.string().optional(),
    amount: zod.number(),
    type: zod.string().max(31).trim().optional(),
    payment: zod.number().max(31).min(1),
    alarm: zod.number().max(31).min(1),
  });
}

export { SubscriptionSchemaLibs };

export type NewSubscriptionProps = zod.infer<typeof SubscriptionSchemaLibs.new>;
