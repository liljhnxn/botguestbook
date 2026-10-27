const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const rpcUrl = process.env.BOTCHAIN_MAINNET_RPC_URL || process.env.BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
  const rawKey = process.env.PRIVATE_KEY?.trim();

  if (!rawKey) {
    console.error("Error: PRIVATE_KEY is missing in .env");
    process.exit(1);
  }

  const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  const networkName = "Botchain Mainnet";
  const explorerBase = "https://scan.botchain.ai";

  console.log("==================================================");
  console.log(`Deploying to: ${networkName} (Chain ID: ${chainId})`);
  console.log(`RPC Endpoint: ${rpcUrl}`);
  console.log(`Deployer Address: ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  console.log(`Current Balance: ${ethers.formatEther(balance)} BOT`);

  const artifactPath = path.join(__dirname, "../artifacts/contracts/BotGuestbook.sol/BotGuestbook.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  // Determine optimal minimal gas price
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || 20000000000n; // 20 gwei standard network gas price
  console.log(`Using Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);

  // Estimate gas units
  const deployTx = await factory.getDeployTransaction();
  const estimatedGas = await provider.estimateGas(deployTx);
  console.log(`Estimated Gas Units: ${estimatedGas.toString()}`);
  const estimatedCost = estimatedGas * gasPrice;
  console.log(`Estimated Cost: ${ethers.formatEther(estimatedCost)} BOT`);

  if (balance < estimatedCost) {
    throw new Error(`Insufficient BOT balance. Have ${ethers.formatEther(balance)} BOT, need ~${ethers.formatEther(estimatedCost)} BOT`);
  }

  console.log("\nBroadcasting deployment transaction with minimal gas...");
  // Set safe gas limit slightly above estimate and minimal gasPrice
  const gasLimit = (estimatedGas * 110n) / 100n; // 10% safety buffer
  const contract = await factory.deploy({
    gasPrice: gasPrice,
    gasLimit: gasLimit,
  });

  const txHash = contract.deploymentTransaction().hash;
  console.log(`Transaction Hash: ${txHash}`);
  console.log(`View pending tx on explorer: ${explorerBase}/tx/${txHash}`);

  console.log("Waiting for confirmation on Botchain...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const receipt = await contract.deploymentTransaction().wait(1);
  const actualGasUsed = receipt.gasUsed;
  const actualGasPrice = receipt.gasPrice || gasPrice;
  const actualCost = actualGasUsed * actualGasPrice;

  console.log("\n==================================================");
  console.log("SUCCESS! BotGuestbook deployed to Botchain Mainnet!");
  console.log("==================================================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Gas Used: ${actualGasUsed.toString()}`);
  console.log(`Effective Gas Price: ${ethers.formatUnits(actualGasPrice, "gwei")} gwei`);
  console.log(`Total Gas Cost: ${ethers.formatEther(actualCost)} BOT`);
  console.log(`Remaining Deployer Balance: ${ethers.formatEther(await provider.getBalance(wallet.address))} BOT`);
  console.log(`Explorer Link: ${explorerBase}/address/${contractAddress}`);
  console.log("==================================================\n");

  return {
    contractAddress,
    txHash,
    actualCost: ethers.formatEther(actualCost),
  };
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
