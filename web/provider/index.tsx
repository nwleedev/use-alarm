import { PropsWithChildren } from "react";
import NotificationProvider from "./Notification";
import PocketBaseProvider from "./PocketBase";
import ReactQueryProvider from "./ReactQuery";

const AppProvider = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <PocketBaseProvider>
      <ReactQueryProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </ReactQueryProvider>
    </PocketBaseProvider>
  );
};

export default AppProvider;
