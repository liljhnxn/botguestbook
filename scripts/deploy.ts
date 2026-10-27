import hre from "hardhat";
const { ethers, network } = hre;

async function main() {
  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    console.error("Error: No signer available. Please configure PRIVATE_KEY in your .env file.");
    process.exit(1);
  }

  const deployer = signers[0];
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const networkName = "Botchain Mainnet";
  const explorerBase = "https://scan.botchain.ai";

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deploying BotGuestbook with account: ${deployer.address}`);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} BOT`);
  console.log(`Target Network: ${networkName} (Chain ID: ${chainId})`);

  const BotGuestbook = await ethers.getContractFactory("BotGuestbook");
  // Enforce minimal optimal gasPrice (20 gwei on Botchain) without wasting funds
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || 20000000000n;
  console.log(`Using gasPrice: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);

  const guestbook = await BotGuestbook.deploy({ gasPrice });
  const deployTx = guestbook.deploymentTransaction();
  console.log(`Deployment transaction submitted: ${deployTx?.hash}`);
  
  await guestbook.waitForDeployment();

  const contractAddress = await guestbook.getAddress();
  const explorerUrl = `${explorerBase}/address/${contractAddress}`;
  const receipt = await deployTx?.wait();
  if (receipt) {
    const cost = receipt.gasUsed * (receipt.gasPrice || gasPrice);
    console.log(`Gas used: ${receipt.gasUsed.toString()} units`);
    console.log(`Deployment cost: ${ethers.formatEther(cost)} BOT`);
  }

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
