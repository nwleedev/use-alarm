"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionType } from "@/lib/subscription/enum";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";

export interface FilterOptions {
  title: string;
  description: string;
  type: string;
  minAmount: string;
  maxAmount: string;
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const filterSchema = z
  .object({
    title: z.string().min(1, "Title must be at least 1 character").optional(),
    description: z.string().optional(),
    type: z.string().optional(),
    minAmount: z.coerce.number().min(0, "Amount must be positive").optional(),
    maxAmount: z.coerce.number().min(0, "Amount must be positive").optional(),
  })
  .refine(
    (data) => {
      if (
        data.type === SubscriptionType.DEFAULT ||
        data.type === SubscriptionType.MONTH ||
        data.type === SubscriptionType.WEEK
      ) {
        return true;
      }
      return false;
    },
    { message: "Invalid subscription type", path: ["type"] }
  )
  .refine(
    (data) => {
      if (data.minAmount && data.maxAmount && data.minAmount > data.maxAmount) {
        return false;
      }
      return true;
    },
    {
      message: "Minimum amount must be less than maximum amount",
      path: ["minAmount"],
    }
  );

export function FilterSheet({ isOpen, onClose }: FilterSheetProps) {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || undefined;
  const description = searchParams.get("description") || undefined;
  const type = searchParams.get("type") || undefined;
  const minAmount = searchParams.get("minAmount") || undefined;
  const maxAmount = searchParams.get("maxAmount") || undefined;
  const filters = {
    title,
    description,
    type,
    minAmount: minAmount ? parseFloat(minAmount) : undefined,
    maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: filters,
  });
  const router = useRouter();
  const { field: typeField } = useController({ control, name: "type" });

  const handleFilter = handleSubmit((data) => {
    const searchParams = new URLSearchParams();
    if (data.title) searchParams.set("title", data.title);
    if (data.description) searchParams.set("description", data.description);
    if (data.type) searchParams.set("type", data.type);
    if (typeof data.minAmount === "number")
      searchParams.set("minAmount", data.minAmount.toString());
    if (typeof data.maxAmount === "number")
      searchParams.set("maxAmount", data.maxAmount.toString());

    const url = `/subscriptions?${searchParams.toString()}`;
    router.push(url);
    onClose();
  });

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Subscriptions">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#0D062D] font-medium">Title</Label>
            <Input
              type="text"
              placeholder="Filter by title"
              className={`border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5] ${
                errors.title ? "border-red-500" : ""
              }`}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[#0D062D] font-medium">Description</Label>
            <Input
              type="text"
              placeholder="Filter by description"
              className={`border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5] ${
                errors.description ? "border-red-500" : ""
              }`}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[#0D062D] font-medium">Type</Label>
            <Select
              value={typeField.value}
              onValueChange={(value) => {
                typeField.onChange(value);
              }}
            >
              <SelectTrigger
                className={`border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5] ${
                  errors.type ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">All</SelectItem>
                <SelectItem value={SubscriptionType.MONTH}>Month</SelectItem>
                <SelectItem value={SubscriptionType.WEEK}>Week</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[#0D062D] font-medium">Amount Range</Label>
            <div className="flex gap-x-4">
              <div className="flex-1 space-y-2">
                <Input
                  type="number"
                  {...register("minAmount")}
                  placeholder="Min amount"
                  className={`border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5] ${
                    errors.minAmount ? "border-red-500" : ""
                  }`}
                />
                {errors.minAmount && (
                  <p className="text-sm text-red-500">
                    {errors.minAmount.message}
                  </p>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  type="number"
                  {...register("maxAmount")}
                  placeholder="Max amount"
                  className={`border-gray-200 focus:border-[#5030E5] focus:ring-[#5030E5] ${
                    errors.maxAmount ? "border-red-500" : ""
                  }`}
                />
                {errors.maxAmount && (
                  <p className="text-sm text-red-500">
                    {errors.maxAmount.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-x-4">
          <Link
            href={"/subscriptions"}
            className="flex-1 py-3 border border-[#787486] text-[#787486] rounded-lg hover:border-[#5030E5] hover:text-[#5030E5] transition-colors text-center"
          >
            Reset
          </Link>
          <button
            onClick={handleFilter}
            className="flex-1 py-3 bg-[#5030E5] text-white rounded-lg hover:bg-[#4024c4] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
