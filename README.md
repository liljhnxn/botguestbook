# BotGuestbook

A simple, polished, decentralized on-chain guestbook built on **Botchain Mainnet**.

Users connect their Web3 wallet and leave short messages (up to 280 characters). Each message is permanently and immutably etched into the Botchain blockchain, accompanied by the sender's wallet address and the block timestamp.

---

## 🚀 Features

- **Wallet Connection**: Seamless connection, disconnection, and network detection powered by wagmi and viem.
- **On-Chain Message Storage**: Messages are directly stored on the Botchain blockchain in the smart contract storage.
- **Block Timestamps**: Every message records an accurate on-chain block timestamp.
- **Event-Driven**: Emits `MessageAdded` events on each entry for transparent indexing.
- **Botchain Mainnet Live**: Deployed on Botchain Mainnet (Chain ID `677`).
- **Explorer Links**: Direct links to view transactions and sender addresses on the Botchain Explorer (`https://scan.botchain.ai`).
- **Graceful Unconfigured Mode**: Cleanly warns users if the contract address has not yet been deployed or configured without breaking the UI.

---

## 🛠️ Tech Stack

- **Smart Contract**: Solidity `^0.8.24`, Hardhat, ethers.js
- **Frontend Framework**: Next.js (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS (Dark Futuristic Web3 aesthetic)
- **Web3 Libraries**: wagmi v2, viem v2, @tanstack/react-query
- **Icons**: Lucide React

---

## 🌐 Botchain Mainnet Configuration

| Property | Value |
| :--- | :--- |
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Block Explorer** | `https://scan.botchain.ai` |
| **Native Token** | `BOT` |
| **Total Supply** | 150 Million BOT |
| **Deployed Contract** | `0x37824B3E16B68dBcF34c9e05BB9a042d952ee73b` |

---

## 📁 Project Structure

```text
botguestbook/
├── contracts/
│   └── BotGuestbook.sol        # Solidity smart contract
├── test/
│   └── BotGuestbook.ts         # Hardhat automated tests
├── scripts/
│   ├── deploy-direct.js        # Direct zero-overhead Mainnet deployment script
│   └── deploy.ts               # Hardhat deployment script
├── app/
│   ├── page.tsx                # Main dApp single-page interface
│   ├── layout.tsx              # Root layout & SEO meta tags
│   ├── providers.tsx           # wagmi & React Query provider setup
│   └── globals.css             # Tailwind styling & cyberpunk theme
├── components/
│   ├── WalletButton.tsx        # Wallet connect/disconnect & network switcher
│   ├── GuestbookForm.tsx       # Message input, character counter & submit flow
│   └── MessageList.tsx         # On-chain message cards (newest first)
├── lib/
│   ├── contract.ts             # Contract ABI, address configuration & utilities
│   └── botchain.ts             # Custom viem chain definition for Botchain Mainnet
├── .env.example                # Environment variable template
├── hardhat.config.ts           # Hardhat configuration
├── package.json
└── README.md
```

---

## 💻 Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Smart Contract Tests

Run the complete automated test suite using Hardhat:

```bash
npm test
# or
npx hardhat test
```

### 3. Compile Smart Contract

```bash
npm run compile
# or
npx hardhat compile
```

### 4. Run Next.js Frontend Locally

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Botchain Mainnet

### 1. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your deployer account's private key (make sure the wallet holds native BOT for gas):

```env
PRIVATE_KEY=your_private_key_here
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
BOTCHAIN_MAINNET_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_BOT_GUESTBOOK_ADDRESS=0x37824B3E16B68dBcF34c9e05BB9a042d952ee73b
```

> **Security Note:** Never commit your real private key to version control. The `.env` file should remain in your `.gitignore`.

### 2. Deploy Contract
 
Run the deployment script configured for Botchain Mainnet:
 
```bash
npm run deploy:mainnet
```

Upon successful deployment, the script outputs:

```text
==================================================
SUCCESS! BotGuestbook deployed to Botchain Mainnet!
==================================================
Contract Address: 0x37824B3E16B68dBcF34c9e05BB9a042d952ee73b
Gas Used: 535106
Effective Gas Price: 20.0 gwei
Total Gas Cost: 0.01070212 BOT
Explorer Link: https://scan.botchain.ai/address/0x37824B3E16B68dBcF34c9e05BB9a042d952ee73b
==================================================
```

### 3. Link Contract Address to Frontend

Set the deployed contract address in `.env`:

```env
NEXT_PUBLIC_BOT_GUESTBOOK_ADDRESS=0x37824B3E16B68dBcF34c9e05BB9a042d952ee73b
```

Restart the Next.js dev server or build the application:

```bash
npm run build
npm run start
```

### 4. Verify Contract on Explorer

To verify the contract source code on Botchain Explorer:

```bash
npm run verify
```

---

## 🔒 Security & Best Practices

- **Zero Privileges / Backdoors**: No admin keys, pause mechanisms, or owner withdrawal functions.
- **Input Validation**: Rejects empty strings and enforces `MAX_MESSAGE_LENGTH = 280` characters.
- **Gas Efficiency**: Pure append-only storage and lightweight memory reads.
- **Graceful Error Handling**: Detects disconnected wallets, wrong networks, and unconfigured contract addresses cleanly in the user interface.
