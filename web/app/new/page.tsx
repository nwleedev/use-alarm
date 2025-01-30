"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { EmojiLibs } from "@/lib/emoji";
import { SubscriptionType } from "@/lib/subscription/enum";
import {
  NewSubscriptionProps,
  SubscriptionSchemaLibs,
} from "@/lib/subscription/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDate, subDays } from "date-fns";
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
  const methods = useForm<NewSubscriptionProps>({
    resolver: zodResolver(SubscriptionSchemaLibs.new),
    defaultValues: {
      type: SubscriptionType.MONTH,
      payment: getDate(now),
      alarm: getDate(subDays(now, 1)),
    },
  });
  const { handleSubmit, register, setValue, control } = methods;
  const onSubmit = handleSubmit((form) => {
    action(form);
  });
  const {
    field: { value: icon },
  } = useController({ control, name: "icon" });
  const {
    field: { value: type = SubscriptionType.MONTH },
  } = useController({ control, name: "type" });
  return (
    <div className="flex flex-col flex-1">
      <div className="h-[60px] w-full flex items-center p-4 gap-x-2 shadow-sm">
        <Link href="/">
          <ChevronLeft />
        </Link>
        <h1 className="">New Subscription</h1>
      </div>
      <FormProvider {...methods}>
        <div className="w-full flex flex-col flex-1 p-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-y-4 flex-1">
            <div></div>
            <div className="flex flex-col gap-y-2">
              <Label>Name</Label>
              <Input type="text" {...register("name")} />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Icon</Label>
              <div className="w-full flex gap-x-4 items-center">
                {icon && (
                  <div className="p-2">
                    <p>{icon}</p>
                  </div>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-transparent border-dashed border border-black shadow-none text-black hover:text-white">
                      Add icon
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[90%]">
                    <DialogHeader>
                      <DialogTitle>Select Emoji</DialogTitle>
                      <DialogDescription>
                        You can choose a emoji associated with this
                        subscription.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="w-full flex justify-between">
                      <div className="w-full h-[240px] overflow-y-scroll grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-y-3">
                        {EmojiLibs.data.map((emoji) => {
                          return (
                            <DialogClose
                              key={emoji}
                              onClick={() => {
                                setValue("icon", emoji);
                              }}
                              className="flex justify-center items-center text-xl"
                            >
                              {emoji}
                            </DialogClose>
                          );
                        })}
                      </div>
                    </div>
                    <DialogFooter className="flex gap-x-2 flex-row">
                      <DialogClose asChild className="w-full">
                        <Button>Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild className="w-full">
                        <Button>Enter</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Description</Label>
              <Input type="text" {...register("description")} />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                {...register("amount", { valueAsNumber: true })}
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <Label>Type</Label>
              <Select
                onValueChange={(value) => {
                  setValue("type", value);
                }}
                defaultValue={SubscriptionType.MONTH}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the subscription type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SubscriptionType.MONTH}>Month</SelectItem>
                  <SelectItem value={SubscriptionType.WEEK}>Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {type === SubscriptionType.MONTH && <MonthInput />}
            {type === SubscriptionType.WEEK && <WeekInput />}
            <Button className="mt-auto">Add Subscription</Button>
          </form>
        </div>
      </FormProvider>
    </div>
  );
}

const MonthInput = () => {
  const methods = useFormContext<NewSubscriptionProps>();
  const { register } = methods;

  return (
    <div className="flex items-center gap-x-2 w-full">
      <div className="flex flex-col gap-y-2 w-full">
        <Label>Payment Day</Label>
        <Input
          type="number"
          {...register("payment", { valueAsNumber: true })}
        />
      </div>
      <div className="flex flex-col gap-y-2 w-full">
        <Label>Alarm Day</Label>
        <Input type="number" {...register("alarm", { valueAsNumber: true })} />
      </div>
    </div>
  );
};

const WeekInput = () => {
  const methods = useFormContext<NewSubscriptionProps>();
  const { setValue } = methods;

  return (
    <div className="flex items-center gap-x-2 w-full">
      <div className="flex flex-col gap-y-2 w-full">
        <Label>Payment Day</Label>
        <Select
          onValueChange={(day) => {
            setValue("payment", Number(day));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment day" />
          </SelectTrigger>
          <SelectContent>
            {DateLibs.WEEK_DAYS.map((day) => {
              return (
                <SelectItem value={String(day)} key={DateLibs.formatDay(day)}>
                  {DateLibs.formatDay(day)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-y-2 w-full">
        <Label>Alarm Day</Label>
        <Select
          onValueChange={(day) => {
            setValue("alarm", Number(day));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select alarm day" />
          </SelectTrigger>
          <SelectContent>
            {DateLibs.WEEK_DAYS.map((day) => {
              return (
                <SelectItem value={String(day)} key={DateLibs.formatDay(day)}>
                  {DateLibs.formatDay(day)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
