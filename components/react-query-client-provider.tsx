"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

const client = new QueryClient();

type ReactQueryClientProviderProps = {
  children: ReactNode;
};

const ReactQueryClientProvider: FC<ReactQueryClientProviderProps> = ({
  children,
}) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default ReactQueryClientProvider;
