import hre from "hardhat";
const { ethers, network } = hre;

async function main() {
  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    console.error("Error: No signer available. Please configure PRIVATE_KEY in your .env file.");
    process.exit(1);
  }

  const deployer = signers[0];
  const networkName = network.name === "botchainTestnet" ? "Botchain Testnet" : network.name;
  const chainId = (await ethers.provider.getNetwork()).chainId;

  console.log(`Deploying BotGuestbook with account: ${deployer.address}`);
  console.log(`Target Network: ${networkName} (Chain ID: ${chainId})`);

  const BotGuestbook = await ethers.getContractFactory("BotGuestbook");
  const guestbook = await BotGuestbook.deploy();
  await guestbook.waitForDeployment();

  const contractAddress = await guestbook.getAddress();
  const explorerUrl = `https://scan.bohr.life/address/${contractAddress}`;

  console.log("\n-------------------------------------------");
  console.log("BotGuestbook deployed successfully!");
  console.log(`Network: ${networkName}`);
  console.log(`Chain ID: ${chainId}`);
  console.log(`Contract: ${contractAddress}`);
  console.log(`Explorer: ${explorerUrl}`);
  console.log("-------------------------------------------\n");
  console.log(`To use in your frontend, set in your .env:`);
  console.log(`NEXT_PUBLIC_BOT_GUESTBOOK_ADDRESS=${contractAddress}\n`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
