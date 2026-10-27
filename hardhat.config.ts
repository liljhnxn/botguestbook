import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const rawKey = process.env.PRIVATE_KEY?.trim();
const accounts = rawKey ? [rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    botchainMainnet: {
      url: process.env.BOTCHAIN_MAINNET_RPC_URL || process.env.BOTCHAIN_RPC_URL || "https://rpc.botchain.ai",
      chainId: 677,
      gasPrice: 20000000000, // 20 gwei standard network gas price to minimize gas fees
      accounts: accounts.length > 0 ? accounts : undefined,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: {
      botchainMainnet: "placeholder",
    },
    customChains: [
      {
        network: "botchainMainnet",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
    ],
  },
};

export default config;
