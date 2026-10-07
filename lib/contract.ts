import { type Address } from "viem";

export const BOT_GUESTBOOK_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "text",
        type: "string",
      },
    ],
    name: "addMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "text",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "MessageAdded",
    type: "event",
  },
  {
    inputs: [],
    name: "getAllMessages",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "string",
            name: "text",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct BotGuestbook.Message[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getMessage",
    outputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "string",
        name: "text",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMessageCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "messages",
    outputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "string",
        name: "text",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_MESSAGE_LENGTH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const BOT_GUESTBOOK_ADDRESS: Address | undefined = (() => {
  const addr = process.env.NEXT_PUBLIC_BOT_GUESTBOOK_ADDRESS?.trim();
  if (addr && addr.startsWith("0x") && addr.length === 42) {
    return addr as Address;
  }
  return undefined;
})();

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address || "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestampSeconds: bigint | number): string {
  const date = new Date(Number(timestampSeconds) * 1000);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getExplorerTxUrl(txHash: string): string {
  return `https://scan.bohr.life/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `https://scan.bohr.life/address/${address}`;
}
