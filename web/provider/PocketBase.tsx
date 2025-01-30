"use client";

import PocketBaseLibs from "@/lib/pocket-base";
import PocketBase from "pocketbase";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react";

const PocketBaseContext = createContext<PocketBase>(null!);

const PocketBaseProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const client = PocketBaseLibs.getClient();
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) {
      return;
    }
    try {
      client.authStore.loadFromCookie(document.cookie);
      client.collection("users").authRefresh();
      ref.current = true;
    } catch (error) {
      if (
        error instanceof Error &&
        "statusCode" in error &&
        error.statusCode === 401
      ) {
        return;
      }
    }
  }, [client]);

  return (
    <PocketBaseContext.Provider value={client}>
      {children}
    </PocketBaseContext.Provider>
  );
};

const usePocketClient = () => {
  const client = useContext(PocketBaseContext);
  if (!client) {
    throw new Error(
      "usePocketClient should be called in PocketBaseContext Provider."
    );
  }

  return client;
};

export { usePocketClient };

export default PocketBaseProvider;
