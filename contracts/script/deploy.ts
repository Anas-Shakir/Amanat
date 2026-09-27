import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";
  const rawKey = process.env.RELAYER_PRIVATE_KEY;

  if (!rawKey) {
    console.error("❌ RELAYER_PRIVATE_KEY missing in .env.local");
    process.exit(1);
  }

  const formattedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(formattedKey, provider);

  console.log("==================================================");
  console.log("Deploying AmanatAidPool to Base Sepolia (Chain 84532)");
  console.log("Deployer Address:", wallet.address);
  console.log("==================================================");

  const balance = await provider.getBalance(wallet.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "ETH");

  if (balance === BigInt(0)) {
    console.log("\n⚠️  Deployer wallet has 0 ETH on Base Sepolia.");
    console.log("👉 Get free faucet ETH at https://faucets.chain.link/base-sepolia or https://base.org/faucets");
    console.log("👉 Deployer address: " + wallet.address + "\n");
    return;
  }

  const artifactPath = path.resolve("contracts/artifacts/contracts/src/AmanatAidPool.sol/AmanatAidPool.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  console.log("Broadcasting deployment transaction to Base Sepolia...");
  const contract = await factory.deploy(wallet.address, wallet.address);
  console.log("Transaction Hash:", contract.deploymentTransaction()?.hash);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ AmanatAidPool successfully deployed!");
  console.log("Contract Address:", contractAddress);
  console.log(`Explorer: https://sepolia.basescan.org/address/${contractAddress}`);
  console.log("==================================================");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
