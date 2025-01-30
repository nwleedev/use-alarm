import { RecordModel } from "pocketbase";
import { User } from "../user";

export interface Subscription<HasUser extends boolean = false>
  extends RecordModel {
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
  expand: HasUser extends true ? User : undefined;
}
