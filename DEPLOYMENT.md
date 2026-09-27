# Amanat — Production Deployment & Configuration Guide

This guide provides step-by-step instructions for deploying the **Amanat Verifiable Local Aid Infrastructure** to production on **Vercel**, connecting **Supabase**, and broadcasting smart contracts to **Base Sepolia (Chain ID: 84532)**.

---

## 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **GitHub Account**: For version control & Vercel CI/CD
- **Supabase Account**: For PostgreSQL database & Auth
- **EVM Wallet**: Metamask / Coinbase Wallet with Base Sepolia testnet ETH
- **Vercel Account**: For Next.js production hosting

---

## 2. Step 1: Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire migration file from [`supabase/migrations/01_initial_schema.sql`](supabase/migrations/01_initial_schema.sql).
4. Navigate to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
5. Optional: Seed the database with initial Dadu merchants & campaigns:
   ```bash
   npm run seed
   ```

---

## 3. Step 2: Smart Contract Deployment (Base Sepolia #84532)

1. **Get Testnet ETH**:
   - Obtain testnet ETH on Base Sepolia from:
     - [Base Official Faucets](https://base.org/faucets)
     - [Chainlink Faucet](https://faucets.chain.link/base-sepolia)
     - [Alchemy Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)

2. **Configure Relayer Wallet**:
   In your `.env.local` (or CI environment):
   ```env
   BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
   RELAYER_PRIVATE_KEY="0x..." # Your funded wallet private key
   ```

3. **Deploy the Smart Contract**:
   ```bash
   npx hardhat run contracts/script/deploy.ts --network baseSepolia
   ```
   *The deployment script will compile `AmanatAidPool.sol` (OpenZeppelin 5.6) and output the deployed contract address on Base Sepolia.*

4. **Set the Contract Address**:
   ```env
   NEXT_PUBLIC_AMANAT_CONTRACT_ADDRESS="0x..." # Paste deployed contract address
   ```

---

## 4. Step 3: Vercel Production Deployment

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy Amanat production release"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and select the `Amanat` repository.
   - Framework preset: `Next.js`.

3. **Configure Production Environment Variables**:
   Add the following variables in the Vercel Project Settings:

   | Variable Name | Description | Example / Required |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_APP_NAME` | Application Name | `Amanat` |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://xyz.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anon Key | `eyJh...` |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret | `eyJh...` |
   | `NEXT_PUBLIC_BASE_SEPOLIA_CHAIN_ID`| Base Sepolia Chain ID | `84532` |
   | `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL` | Base Sepolia RPC URL | `https://sepolia.base.org` |
   | `NEXT_PUBLIC_AMANAT_CONTRACT_ADDRESS` | Deployed Contract Address | `0x...` |
   | `RELAYER_PRIVATE_KEY` | Relayer Wallet Key for Gasless Subsidies | `0x...` |
   | `MESSAGING_PROVIDER` | Notification Provider | `demo` / `twilio` / `whatsapp` |

4. **Deploy**:
   - Click **Deploy**. Vercel will build and assign your production URL (e.g. `https://amanat-aid.vercel.app`).

---

## 5. Step 4: Verification & Smoke Testing

Run the automated test suites against your production URL:

```bash
# Security & Abuse Regression Suite
TEST_BASE_URL="https://your-app.vercel.app" npm run test:security

# Complete End-to-End Lifecycle Verification
TEST_BASE_URL="https://your-app.vercel.app" npm run test:e2e
```

---

## 6. Offline PWA Validation
1. Open the production URL on an Android or iOS device in Chrome / Safari.
2. Tap **Install Amanat App** from the banner.
3. Turn on **Airplane Mode** and test the Merchant Keypad (`/merchant`) — redemptions will queue in local encrypted storage and sync automatically when internet is reconnected.
