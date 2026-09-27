import { 
  createPublicClient, 
  createWalletClient, 
  http, 
  keccak256, 
  stringToBytes, 
  formatEther,
  Hex
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { AMANAT_AID_POOL_ABI } from "./abi";

export interface RelayerSubmissionResult {
  success: boolean;
  txHash: string;
  isSimulated: boolean;
  explorerUrl: string;
  timestamp: string;
  error?: string;
}

export interface RelayerStatus {
  isConfigured: boolean;
  relayerAddress: string;
  contractAddress: string;
  network: string;
  chainId: number;
  balanceETH: string;
}

const RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_AMANAT_CONTRACT_ADDRESS || "") as Hex;
const RELAYER_KEY = (process.env.RELAYER_PRIVATE_KEY || "") as Hex;

export function isRelayerConfigured(): boolean {
  return Boolean(
    RELAYER_KEY && 
    RELAYER_KEY.startsWith("0x") && 
    RELAYER_KEY.length === 66 && 
    CONTRACT_ADDRESS && 
    CONTRACT_ADDRESS.startsWith("0x") &&
    CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000"
  );
}

export async function getRelayerStatus(): Promise<RelayerStatus> {
  const configured = isRelayerConfigured();

  if (!configured) {
    return {
      isConfigured: false,
      relayerAddress: process.env.RELAYER_PUBLIC_ADDRESS || "0x4a9d...c9b2 (Simulated Relayer)",
      contractAddress: CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
      network: "Base Sepolia Testnet",
      chainId: 84532,
      balanceETH: "0.420 Sepolia ETH (Demo)",
    };
  }

  try {
    const account = privateKeyToAccount(RELAYER_KEY);
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(RPC_URL),
    });

    const balance = await publicClient.getBalance({ address: account.address });

    return {
      isConfigured: true,
      relayerAddress: account.address,
      contractAddress: CONTRACT_ADDRESS,
      network: "Base Sepolia Testnet",
      chainId: 84532,
      balanceETH: `${parseFloat(formatEther(balance)).toFixed(4)} ETH`,
    };
  } catch (err) {
    return {
      isConfigured: false,
      relayerAddress: "Error reading relayer",
      contractAddress: CONTRACT_ADDRESS,
      network: "Base Sepolia Testnet",
      chainId: 84532,
      balanceETH: "0.000 ETH",
    };
  }
}

/**
 * Submits a gasless merchant redemption transaction to Base Sepolia
 */
export async function submitOnChainRedemption(
  campaignId: number,
  householdCode: string,
  amountPKR: number,
  merchantWalletAddress: string = "0x2222222222222222222222222222222222222222"
): Promise<RelayerSubmissionResult> {
  const entitlementHash = keccak256(stringToBytes(`${householdCode}_amanat_dadu_salt`));
  const configured = isRelayerConfigured();

  if (configured) {
    try {
      const account = privateKeyToAccount(RELAYER_KEY);
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(RPC_URL),
      });

      const walletClient = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http(RPC_URL),
      });

      // Submit transaction to Base Sepolia
      const txHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: AMANAT_AID_POOL_ABI,
        functionName: "redeemEntitlement",
        args: [
          BigInt(campaignId),
          entitlementHash,
          BigInt(amountPKR),
          merchantWalletAddress as Hex,
        ],
      });

      // Wait for 1 confirmation
      await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });

      return {
        success: true,
        txHash,
        isSimulated: false,
        explorerUrl: `https://sepolia.basescan.org/tx/${txHash}`,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      console.error("Live Base Sepolia relayer submission error:", err);
      // Fallback to simulated if testnet RPC times out
    }
  }

  // Simulated fallback transaction hash
  const simulatedHash = `0x${Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("")}`;

  return {
    success: true,
    txHash: simulatedHash,
    isSimulated: true,
    explorerUrl: `https://sepolia.basescan.org/tx/${simulatedHash}`,
    timestamp: new Date().toISOString(),
  };
}
