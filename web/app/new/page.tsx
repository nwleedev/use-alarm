"use client";

import { EmojiSelectSheet } from "@/components/EmojiSelectSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateLibs } from "@/lib/date";
import { SubscriptionType } from "@/lib/subscription/enum";
import {
  NewSubscriptionProps,
  SubscriptionSchemaLibs,
} from "@/lib/subscription/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getDate, subDays } from "date-fns";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from "react-hook-form";
import { action } from "./action";

export default function Page() {
  const [now] = useState(new Date());
  const client = useQueryClient();
  const methods = useForm<NewSubscriptionProps>({
    resolver: zodResolver(SubscriptionSchemaLibs.new),
    defaultValues: {
      type: SubscriptionType.MONTH,
      payment: getDate(now),
      alarm: getDate(subDays(now, 1)),
    },
  });
  const { handleSubmit, register, setValue, control } = methods;
  const onSubmit = handleSubmit(async (form) => {
    await action(form);
    if (form.type === SubscriptionType.MONTH) {
      client.refetchQueries({ queryKey: ["SUBSCRIPTION_MONTH"] });
    } else {
      client.refetchQueries({ queryKey: ["SUBSCRIPTION_WEEK"] });
    }
  });
  const {
    field: { value: icon },
  } = useController({ control, name: "icon" });
  const {
    field: { value: type = SubscriptionType.MONTH },
  } = useController({ control, name: "type" });

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="w-full flex items-center h-[70px] justify-between px-6 bg-white shadow-sm sticky top-0">
        <div className="flex items-center gap-x-4">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#787486]" />
          </Link>
          <h2 className="text-xl font-bold text-[#0D062D]">New Subscription</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-2">
                <Label className="text-[#0D062D] font-medium">Name</Label>
                <Input
                  type="text"
                  {...register("name")}
                  className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]"
                  placeholder="Enter subscription name"
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <Label className="text-[#0D062D] font-medium">Icon</Label>
                <div className="flex gap-x-4 items-center">
                  {icon && <div className="p-2 text-2xl">{icon}</div>}
                  <EmojiSelectSheet
                    trigger={<Button>Select a emoji</Button>}
                    onEmojiSelect={(emoji) => {
                      setValue("icon", emoji);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-y-2">
                <Label className="text-[#0D062D] font-medium">
                  Description
                </Label>
                <Input
                  type="text"
                  {...register("description")}
                  className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]"
                  placeholder="Enter subscription description"
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <Label className="text-[#0D062D] font-medium">Amount</Label>
                <Input
                  type="number"
                  {...register("amount", { valueAsNumber: true })}
                  className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]"
                  placeholder="Enter amount"
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <Label className="text-[#0D062D] font-medium">Type</Label>
                <Select
                  onValueChange={(value) => setValue("type", value)}
                  defaultValue={SubscriptionType.MONTH}
                >
                  <SelectTrigger className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]">
                    <SelectValue placeholder="Select subscription type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SubscriptionType.MONTH}>
                      Monthly
                    </SelectItem>
                    <SelectItem value={SubscriptionType.WEEK}>
                      Weekly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {type === SubscriptionType.MONTH && <MonthInput />}
              {type === SubscriptionType.WEEK && <WeekInput />}

              <Button
                type="submit"
                className="mt-6 bg-[#5030E5] hover:bg-[#4024B8] transition-colors"
              >
                Create Subscription
              </Button>
            </form>
          </FormProvider>
        </motion.div>
      </div>
    </div>
  );
}

const MonthInput = () => {
  const methods = useFormContext<NewSubscriptionProps>();
  const { register } = methods;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-y-2">
        <Label className="text-[#0D062D] font-medium">Payment Date</Label>
        <Input
          type="number"
          {...register("payment", { valueAsNumber: true })}
          className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]"
          placeholder="Enter payment date"
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label className="text-[#0D062D] font-medium">Alarm Days Before</Label>
        <Input
          type="number"
          {...register("alarm", { valueAsNumber: true })}
          className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]"
          placeholder="Enter days before"
        />
      </div>
    </div>
  );
};

const WeekInput = () => {
  const methods = useFormContext<NewSubscriptionProps>();
  const { setValue } = methods;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-y-2">
        <Label className="text-[#0D062D] font-medium">Payment Day</Label>
        <Select onValueChange={(day) => setValue("payment", Number(day))}>
          <SelectTrigger className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]">
            <SelectValue placeholder="Select payment day" />
          </SelectTrigger>
          <SelectContent>
            {DateLibs.WEEK_DAYS.map((day) => (
              <SelectItem value={String(day)} key={DateLibs.formatDay(day)}>
                {DateLibs.formatDay(day)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-y-2">
        <Label className="text-[#0D062D] font-medium">Alarm Day</Label>
        <Select onValueChange={(day) => setValue("alarm", Number(day))}>
          <SelectTrigger className="border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5]">
            <SelectValue placeholder="Select alarm day" />
          </SelectTrigger>
          <SelectContent>
            {DateLibs.WEEK_DAYS.map((day) => (
              <SelectItem value={String(day)} key={DateLibs.formatDay(day)}>
                {DateLibs.formatDay(day)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export const runtime = "edge";
