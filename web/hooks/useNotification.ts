import { NotificationContext } from "@/provider/Notification";
import { useContext } from "react";

const useNotification = () => {
  return useContext(NotificationContext);
};

export default useNotification;
