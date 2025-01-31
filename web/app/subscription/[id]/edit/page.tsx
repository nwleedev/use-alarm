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
import { Subscription } from "@/models/subscription";
import { usePocketClient } from "@/provider/PocketBase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from "react-hook-form";
import { action } from "./action";

function EditForm() {
  const { id } = useParams<{ id: string }>();
  const client = usePocketClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["SUBSCRIPTION", id] as const,
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;

      const sub = (await client
        .collection("subscriptions")
        .getOne(id)) as Subscription;

      return sub;
    },
  });
  const methods = useForm<NewSubscriptionProps>({
    resolver: zodResolver(SubscriptionSchemaLibs.new),
    defaultValues: {
      name: data?.name,
      icon: data?.icon,
      description: data?.description,
      type: data?.type,
      amount: data?.amount,
      payment: data?.payment,
      alarm: data?.alarm,
    },
  });
  const { register, handleSubmit, formState, setValue, control } = methods;
  const onSubmit = handleSubmit(async (form) => {
    await action(id, form);

    refetch();
  });
  const { field } = useController({ control, name: "icon" });
  const { field: type } = useController({ control, name: "type" });
  return (
    <div className="w-full flex flex-col p-4">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
          <div></div>
          <div className="flex flex-col gap-y-2">
            <Label>Name</Label>
            <Input type="text" {...register("name")} />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Icon</Label>
            <div className="w-full flex gap-x-4 items-center">
              {field.value && (
                <div className="p-2">
                  <p>{field.value}</p>
                </div>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-transparent border-dashed border border-black shadow-none text-black">
                    Edit icon
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%]">
                  <DialogHeader>
                    <DialogTitle>Select Emoji</DialogTitle>
                    <DialogDescription>
                      You can choose a emoji associated with this subscription.
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
              defaultValue={data?.type}
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
          {type.value === SubscriptionType.MONTH && <MonthInput />}
          {type.value === SubscriptionType.WEEK && <WeekInput />}
          <Button>Edit Subscription</Button>
        </form>
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
  const { setValue, control } = methods;
  const { field: alarm } = useController({ control, name: "alarm" });
  const { field: payment } = useController({ control, name: "payment" });

  return (
    <div className="flex items-center gap-x-2 w-full">
      <div className="flex flex-col gap-y-2 w-full">
        <Label>Payment Day</Label>
        <Select
          defaultValue={String(payment.value)}
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
          defaultValue={String(alarm.value)}
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

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const client = usePocketClient();
  const { isFetched } = useQuery({
    queryKey: ["SUBSCRIPTION", id] as const,
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;

      const sub = (await client
        .collection("subscriptions")
        .getOne(id)) as Subscription;

      return sub;
    },
  });
  return (
    <div className="">
      <div className="h-[60px] w-full flex items-center p-4 gap-x-2 shadow-sm">
        <Link href="/">
          <ChevronLeft />
        </Link>
        <h2 className="font-semibold whitespace-nowrap flex-shrink-0">
          Edit Subscription
        </h2>
      </div>
      <Suspense>{isFetched && <EditForm />}</Suspense>
    </div>
  );
}

export const runtime = "edge";
