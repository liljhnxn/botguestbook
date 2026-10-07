# BotGuestbook

A simple, polished, decentralized on-chain guestbook built on **Botchain Testnet**.

Users connect their Web3 wallet and leave short messages (up to 280 characters). Each message is permanently and immutably etched into the Botchain blockchain, accompanied by the sender's wallet address and the block timestamp.

---

## 🚀 Features

- **Wallet Connection**: Seamless connection, disconnection, and network detection powered by wagmi and viem.
- **On-Chain Message Storage**: Messages are directly stored on the Botchain blockchain in the smart contract storage.
- **Block Timestamps**: Every message records an accurate on-chain block timestamp.
- **Event-Driven**: Emits `MessageAdded` events on each entry for transparent indexing.
- **Botchain Testnet Support**: Built specifically for Botchain Testnet (Chain ID `968`).
- **Explorer Links**: Direct links to view transactions and sender addresses on the Botchain Explorer (`https://scan.bohr.life`).
- **Graceful Unconfigured Mode**: Cleanly warns users if the contract address has not yet been deployed or configured without breaking the UI.

---

## 🛠️ Tech Stack

- **Smart Contract**: Solidity `^0.8.24`, Hardhat, ethers.js
- **Frontend Framework**: Next.js (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS (Dark Futuristic Web3 aesthetic)
- **Web3 Libraries**: wagmi v2, viem v2, @tanstack/react-query
- **Icons**: Lucide React

---

## 🌐 Botchain Testnet Configuration

| Property | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Block Explorer** | `https://scan.bohr.life` |
| **Currency Symbol** | `BOT` |

---

## 📁 Project Structure

```text
botguestbook/
├── contracts/
│   └── BotGuestbook.sol        # Solidity smart contract
├── test/
│   └── BotGuestbook.ts         # Hardhat automated tests
├── scripts/
│   └── deploy.ts               # Botchain Testnet deployment script
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
│   └── botchain.ts             # Custom viem chain definition for Botchain Testnet
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

## 🚢 Deploying to Botchain Testnet

### 1. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your deployer account's private key (make sure the wallet holds some testnet BOT for gas):

```env
PRIVATE_KEY=your_private_key_here
BOTCHAIN_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_BOT_GUESTBOOK_ADDRESS=
```

> **Security Note:** Never commit your real private key to version control. The `.env` file should remain in your `.gitignore`.

### 2. Deploy Contract

Run the deployment script configured for Botchain Testnet:

```bash
npm run deploy:testnet
```

Upon successful deployment, the script outputs:

```text
BotGuestbook deployed successfully!
Network: Botchain Testnet
Chain ID: 968
Contract: 0x...
Explorer: https://scan.bohr.life/address/0x...
```

### 3. Link Contract Address to Frontend

Copy the generated contract address from the deployment output and paste it into your `.env`:

```env
NEXT_PUBLIC_BOT_GUESTBOOK_ADDRESS=0xYourDeployedContractAddress
```

Restart the Next.js dev server or rebuild the application:

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
