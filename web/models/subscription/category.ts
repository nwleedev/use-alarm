import { RecordModel } from "pocketbase";

export interface Category extends RecordModel {
  id: string;
  name: string;
}
