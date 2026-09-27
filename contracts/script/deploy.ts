import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("==================================================");
  console.log("Deploying AmanatAidPool to Base Sepolia (Chain 84532)");
  console.log("Deployer Address:", deployer.address);
  console.log("==================================================");

  const relayerAddress = process.env.RELAYER_PUBLIC_ADDRESS || deployer.address;
  console.log("Configured Relayer Address:", relayerAddress);

  const AmanatAidPool = await ethers.getContractFactory("AmanatAidPool");
  const pool = await AmanatAidPool.deploy(deployer.address, relayerAddress);
  await pool.waitForDeployment();

  const contractAddress = await pool.getAddress();
  console.log("✅ AmanatAidPool successfully deployed!");
  console.log("Contract Address:", contractAddress);
  console.log(`Explorer: https://sepolia.basescan.org/address/${contractAddress}`);
  console.log("==================================================");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
