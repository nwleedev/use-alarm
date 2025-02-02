import { User } from "models/user";
import { RecordModel } from "pocketbase";

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
  expand: HasUser extends true ? { user: User } : undefined;
}
