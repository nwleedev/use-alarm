import { RecordModel } from "pocketbase";
import { User } from "../user";
import { Category } from "./category";

export interface Subscription<
  HasUser extends boolean = false,
  HasCategory extends boolean = true
> extends RecordModel {
  id: string;
  name: string;
  description: string;
  icon?: string;
  amount: number;
  type: "MONTH" | "WEEK";
  payment: number;
  alarm: number;
  created: string;
  updated: string;
  expand: {
    user: HasUser extends true ? User : undefined;
    category: HasCategory extends true ? Category : undefined;
  };
}
