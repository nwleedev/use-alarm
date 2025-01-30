"use client";

import ReactQueryLibs from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const ReactQueryProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const client = ReactQueryLibs.getClient();

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
