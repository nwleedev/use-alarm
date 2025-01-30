import { User } from "models/user";
import { RecordModel } from "pocketbase";

export interface Notification<HasUser extends boolean = false>
  extends RecordModel {
  endpoint: string;
  expand: HasUser extends true ? User : undefined;
  keys: {
    p256dh: string;
    auth: string;
  };
  created: string;
  updated: string;
}
