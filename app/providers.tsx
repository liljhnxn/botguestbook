"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider, createConfig, http, injected } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { botchainTestnet } from "@/lib/botchain";

export const wagmiConfig = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainTestnet.id]: http("https://rpc.bohr.life"),
  },
  ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
