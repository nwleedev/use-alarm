import { RecordModel } from "pocketbase";
import { User } from "../user";

export interface Preference extends RecordModel {
  id: string;
  user: string;
  timezone: string;
  timezoneOffset: number;
  hour: number;
  currency: string;
  created: string;
  updated: string;
  expand?: {
    user: User;
  };
}
