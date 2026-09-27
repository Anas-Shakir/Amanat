import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

export {};

async function main() {
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";
  const rawKey = process.env.RELAYER_PRIVATE_KEY;

  if (!rawKey) {
    console.error("❌ RELAYER_PRIVATE_KEY is missing in .env.local");
    console.error("Please add your wallet private key to .env.local as RELAYER_PRIVATE_KEY=\"...\"");
    process.exit(1);
  }

  const formattedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(formattedKey, provider);

  console.log("================================================================================");
  console.log("  🚀 DEPLOYING AMANAT AID POOL CONTRACT (BASE SEPOLIA #84532)");
  console.log("================================================================================");
  console.log("  Network RPC:      ", rpcUrl);
  console.log("  Deployer Wallet:  ", wallet.address);

  try {
    const balance = await provider.getBalance(wallet.address);
    const balanceEth = ethers.formatEther(balance);
    console.log("  Wallet Balance:   ", balanceEth, "Sepolia ETH");

    if (balance === BigInt(0)) {
      console.log("\n⚠️  Deployer wallet currently has 0 ETH on Base Sepolia.");
      console.log("   To broadcast the smart contract on-chain, please get free testnet ETH from:");
      console.log("   👉 https://faucets.chain.link/base-sepolia");
      console.log("   👉 https://base.org/faucets");
      console.log("   👉 https://www.alchemy.com/faucets/base-sepolia\n");
      console.log("   Your address to paste in the faucet: " + wallet.address + "\n");
      return;
    }

    const artifactPath = path.resolve("contracts/artifacts/contracts/src/AmanatAidPool.sol/AmanatAidPool.json");
    if (!fs.existsSync(artifactPath)) {
      console.error("❌ Artifact not found at " + artifactPath + ". Run npx hardhat compile first.");
      process.exit(1);
    }

    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

    console.log("\nBroadcasting deployment transaction to Base Sepolia...");
    const contract = await factory.deploy(wallet.address, wallet.address);
    console.log("Transaction Hash:", contract.deploymentTransaction()?.hash);
    console.log("Waiting for block confirmation...");

    await contract.waitForDeployment();
    const deployedAddress = await contract.getAddress();

    console.log("\n================================================================================");
    console.log("  ✅ CONTRACT DEPLOYED SUCCESSFULLY!");
    console.log("================================================================================");
    console.log("  Contract Address: ", deployedAddress);
    console.log("  Basescan Explorer:", `https://sepolia.basescan.org/address/${deployedAddress}`);
    console.log("================================================================================\n");

    console.log("👉 Update .env.local with:");
    console.log(`NEXT_PUBLIC_AMANAT_CONTRACT_ADDRESS="${deployedAddress}"\n`);
  } catch (err: any) {
    console.error("Deployment error:", err.message || err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
