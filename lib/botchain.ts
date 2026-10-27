import { defineChain } from "viem";

export const botchainMainnet = defineChain({
  id: 677,
  name: "Botchain",
  nativeCurrency: {
    decimals: 18,
    name: "BOT",
    symbol: "BOT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.botchain.ai"],
    },
    public: {
      http: ["https://rpc.botchain.ai"],
    },
  },
  blockExplorers: {
    default: {
      name: "Botchain Explorer",
      url: "https://scan.botchain.ai",
    },
  },
  testnet: false,
});

export const botchain = botchainMainnet;

