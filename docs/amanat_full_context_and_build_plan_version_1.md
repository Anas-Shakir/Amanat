# Amanat — Verifiable Local Aid Infrastructure
## Product Vision, System Specification, Technology Stack & Build Plan
### Imaginathon 2026 — Dadu, Sindh

---

## 0. Document Purpose

This document is the primary product and engineering context for building **Amanat**.

It is intended to be supplied to a CLI/agentic coding environment as the authoritative high-level specification for the project.

The document defines:

- the problem Amanat is solving
- why Dadu is the initial city
- the product philosophy
- the distinction between normal welfare and emergency/disaster aid
- all major stakeholders
- the end-to-end product flows
- the role of blockchain
- the role of Supabase and off-chain infrastructure
- the privacy model
- the PWA experience
- the merchant/beneficiary/donor/admin experiences
- the technical stack
- the core data model
- the smart-contract responsibilities
- API responsibilities
- security principles
- MVP boundaries
- future expansion directions
- detailed implementation phases
- testing and demonstration requirements

The implementation agent should use this document as the baseline architecture, while being allowed to make small implementation-level decisions where the document intentionally leaves details open.

---

# 1. Product Identity

## 1.1 Name

**Amanat**

The name is intentional.

An *amanat* is something entrusted to someone for safekeeping or faithful delivery.

That maps directly to the product's philosophy:

> When someone entrusts money to help another person, Amanat makes the journey from aid funding to actual assistance more visible, accountable, and verifiable.

---

## 1.2 One-line description

> **Amanat is a local aid infrastructure network that connects humanitarian funding to verified household entitlements and local merchants, creating a traceable path from donated money to actual goods received.**

---

## 1.3 What Amanat is NOT

Amanat is not primarily:

- a generic charity website
- a cryptocurrency wallet
- a blockchain showcase
- an NGO
- a replacement for government disaster response
- an AI system that independently decides who is poor
- a simple digital ration coupon application

Amanat is an **accountability and coordination layer for local aid distribution**.

Blockchain is used where it provides meaningful value: financial settlement, verifiable events, and tamper-resistant auditability.

---

# 2. Core Problem

## 2.1 The fundamental problem

When humanitarian or welfare aid enters a community, there is often weak visibility between:

> **"Aid was allocated"**

and

> **"This household actually received the intended assistance."**

The problem is not always a lack of donations.

The problem can be the chain between:

```text
Need
  ↓
Eligibility / Verification
  ↓
Aid Allocation
  ↓
Funding
  ↓
Local Fulfillment
  ↓
Beneficiary Redemption
  ↓
Merchant Settlement
  ↓
Impact / Accountability
```

This chain can involve multiple organizations, informal processes, physical cash, paper lists, manual distribution, disconnected databases, and limited visibility for donors.

Amanat aims to create a digital infrastructure layer across this chain.

---

# 3. Why Dadu, Sindh?

## 3.1 Initial city

The first geographic focus is:

**Dadu, Sindh, Pakistan**

Dadu is particularly relevant because of its exposure to recurring climate and flood-related disruption and the economic/social pressure that accompanies such events.

The 2022 Pakistan floods demonstrated the scale of humanitarian vulnerability in Sindh and the importance of effective local relief distribution.

Dadu therefore provides a strong environment for designing a system around:

- emergency food assistance
- household-level aid
- local merchant networks
- disaster-response coordination
- transparent distribution
- recovery support

---

## 3.2 Why the city connection matters

Amanat should not be presented as a generic donation platform that happens to operate in Dadu.

The stronger product thesis is:

> **Dadu needs durable local aid infrastructure because crises can repeatedly disrupt households and distribution systems. Amanat creates infrastructure that exists before a disaster, operates during one, and remains useful during recovery and normal welfare periods.**

---

# 4. Disaster-first, Not Disaster-only

Amanat should have a **disaster-first identity**, while remaining usable for normal community welfare.

This is a deliberate product decision.

## 4.1 Emergency Mode

Used for:

- floods
- displacement
- severe weather
- climate emergencies
- sudden food insecurity
- humanitarian crises
- other major disruptions

Example:

> Dadu Flood Emergency Food Relief

---

## 4.2 Community Mode

Used during normal periods for:

- Zakat
- monthly ration assistance
- food sponsorship
- medical assistance
- education assistance
- household welfare
- community-funded support

---

## 4.3 Why both modes matter

Disaster-only infrastructure risks becoming dormant outside emergencies.

Generic charity infrastructure loses the strongest Dadu-specific identity.

Amanat instead follows this principle:

> **The network exists during normal times so that it is already there when disaster strikes.**

During normal periods, Amanat can maintain:

- participating merchants
- partner organizations
- household identities
- aid history
- entitlement infrastructure
- redemption infrastructure
- local distribution relationships

When an emergency occurs, the same network can switch into Emergency Mode.

---

# 5. Product Philosophy

## 5.1 Technology should disappear for beneficiaries

A beneficiary should not need to understand:

- blockchain
- crypto
- wallets
- smart contracts
- gas
- tokens
- technical terminology

The beneficiary should simply receive assistance.

Example:

> **Amanat Aid**
>
> Your household has received a food entitlement of Rs. 4,000.
>
> Voucher: 4827
>
> Redeem at a participating Amanat store.

---

## 5.2 Local infrastructure should be reused

Amanat should not try to replace every existing organization or physical distribution network.

The system should use existing:

- local grocery/kiryana stores
- NGOs
- welfare organizations
- community organizations
- disaster-response partners
- other legitimate aid issuers

Amanat becomes the digital accountability/coordination layer connecting them.

---

## 5.3 Do not blindly trust a single organization

Amanat should reduce reliance on a single centralized authority by creating verifiable records and controlled roles.

The system does not claim that blockchain eliminates trust.

Instead:

> **Amanat makes important actions auditable and creates a shared coordination layer between parties that may not fully trust each other.**

---

# 6. Stakeholder Ecosystem

## 6.1 Donor

### Role

Provides funding to an aid pool/campaign.

### Experience

Uses the Amanat web/PWA dashboard.

### Can:

- browse campaigns
- view campaign objectives
- fund campaigns
- view aggregate impact
- inspect aid allocation/redemption statistics
- view transaction/audit information
- see how much aid has actually been fulfilled

### Does NOT need to:

- manually select individual poor families
- manage crypto wallets in the normal flow
- know merchant details unnecessarily
- interact with blockchain directly

---

# 6.2 Aid Organization / Issuer

Examples include:

- NGO
- welfare organization
- authorized relief partner
- community organization
- potentially government-linked relief entity

### Role

Identifies and verifies households and issues aid entitlements.

### Important principle

Amanat should not autonomously declare:

> "This person is poor."

Instead:

> **Authorized organizations issue entitlements, while Amanat records, manages, distributes, and tracks those entitlements.**

---

# 6.3 Merchant / Kiryana Store

### Role

Acts as a local fulfillment node.

The merchant provides eligible goods to beneficiaries and receives settlement.

### Interface

A very simple mobile-first PWA.

The merchant should see:

- voucher verification
- entitlement amount
- household/beneficiary reference as appropriate
- remaining balance
- confirmation action
- transaction status

The merchant should NOT need:

- crypto knowledge
- wallet management
- gas
- blockchain terminology

---

# 6.4 Beneficiary / Household

### Role

Receives aid entitlement and redeems it through a participating merchant.

### Interface

Prefer:

- SMS
- WhatsApp
- simple web link when appropriate
- printed/physical fallback where necessary

The beneficiary should not be forced to install an application.

---

# 6.5 Amanat Administrator

### Role

Manages:

- campaigns
- organizations
- merchants
- household verification records
- system configuration
- disputes
- audit information
- emergency mode
- monitoring

The admin interface is internal and can be more feature-rich.

---

# 7. Core Product Model

The central model is:

```text
Need
  ↓
Verification
  ↓
Aid Entitlement
  ↓
Funding
  ↓
Voucher
  ↓
Local Merchant
  ↓
Redemption
  ↓
Settlement
  ↓
Audit / Impact
```

This is the core spine of Amanat.

---

# 8. Community-Level Aid Pools

Amanat should not primarily encourage donors to manually choose individual households.

Instead, use **community-level aid pools/campaigns**.

Example:

> **Dadu — Mehar Flood Relief Food Pool**
>
> Target: 500 households
> Required assistance: essential food
> Target funding: Rs. 2,000,000

Donors contribute to the pool.

Authorized organizations then allocate entitlements to verified households.

This separates:

- donor funding
- beneficiary identification
- aid fulfillment

and prevents donors from micromanaging eligibility.

---

# 9. Aid Entitlements

An entitlement represents assistance that a verified household is authorized to receive.

Example:

```text
Household ID: AMN-48291
Area: Johi, Dadu
Household size: 6

Aid category: Emergency Food
Assessment: Flood displacement

Entitlement: Rs. 4,000
Duration: 30 days

Issued by: Authorized Organization
Status: Active
```

The entitlement is not necessarily cash.

It represents a claim against an approved aid pool.

---

# 10. Voucher System

A voucher is the beneficiary-facing representation of an entitlement.

A voucher can contain:

- unique voucher identifier
- short human-friendly verification code
- entitlement reference
- validity period
- status
- remaining amount

Example message:

> **AMANAT AID**
>
> Your household has received a food entitlement of Rs. 4,000.
>
> Voucher: **4827**
>
> Redeem at any participating Amanat store.
>
> Keep this message private.

The exact SMS/WhatsApp copy can be refined later.

---

# 11. Partial Redemption

A major requirement is that a household does not necessarily have to consume the entire entitlement in one transaction.

Example:

```text
Entitlement: Rs. 4,000

First visit:
Rs. 1,350 redeemed

Remaining:
Rs. 2,650
```

Later:

```text
Second visit:
Rs. 1,200 redeemed

Remaining:
Rs. 1,450
```

The system must prevent:

- spending beyond the remaining balance
- reuse after expiry
- duplicate redemption
- concurrent double redemption

---

# 12. Local Merchant Network

Amanat should treat merchants as **micro-fulfillment nodes**.

Example:

```text
                AMANAT AID POOL
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
     Store A         Store B        Store C
        │              │              │
     40 families     27 families    51 families
```

This provides:

- local accessibility
- reduced dependence on centralized distribution points
- potential reduction in long queues
- local economic circulation
- resilience through multiple fulfillment points

---

# 13. Dignity

Amanat should explicitly preserve beneficiary dignity.

Avoid forcing people into unnecessary:

- public queues
- visible labels
- repeated paperwork
- public announcements
- financial disclosure
- crypto interaction

A beneficiary should be able to visit a normal local store and redeem assistance privately.

---

# 14. Household Identity

The initial system should use an **Amanat Household ID**.

Example:

```text
AMN-48291
```

This is an internal/privacy-aware identifier.

Do not use a public blockchain address as a household identity.

Do not expose sensitive personal information on-chain.

---

# 15. Future Aid Passport

A longer-term concept is a privacy-preserving **Amanat Aid Passport**.

It could allow authorized organizations to answer questions such as:

> Has this household already received emergency food assistance recently?

without exposing the household's entire welfare history.

Example:

```text
Food assistance: Rs. 5,000
Cash assistance: Rs. 3,000
Medical assistance: Rs. 1,500
```

Organizations could use this to reduce duplicate assistance and improve allocation.

This is a future capability, not a requirement for the first MVP.

---

# 16. Beneficiary Verification

## 16.1 Principle

Amanat should not become an autonomous poverty classifier.

Authorized organizations should issue/approve entitlements.

---

## 16.2 Verification evidence

Future versions may combine:

- local organization assessment
- disaster-affected area information
- household size
- displacement status
- previous assistance
- community verification
- relevant public disaster information
- other legitimate evidence

The system may calculate a recommendation/confidence score, but:

> **AI can recommend; authorized humans/organizations approve.**

---

# 17. Preventing Duplicate Aid

Amanat can eventually provide participating organizations with a shared view of aid already issued.

Example:

```text
HOUSEHOLD AMN-48291

Food        Rs. 5,000
Cash        Rs. 3,000
Medicine    Rs. 1,500

Total recorded assistance:
Rs. 9,500
```

Another organization can determine whether additional assistance is appropriate.

Important:

The system should not expose all sensitive details to every organization.

Use role-based and purpose-based access.

---

# 18. Privacy Model

Privacy is a core architectural requirement.

## Never put sensitive information directly on a public blockchain.

Do NOT store on-chain:

- full name
- phone number
- CNIC
- home address
- medical information
- family details
- identity documents
- private assessment notes

These remain off-chain in controlled storage.

---

## On-chain information

The chain may contain:

- campaign identifiers
- entitlement references
- merchant references
- amounts
- settlement events
- timestamps
- transaction state
- cryptographic hashes/commitments where appropriate

The exact privacy-preserving representation should be reviewed during implementation.

---

# 19. Blockchain Purpose

Blockchain is not the product.

It provides specific infrastructure capabilities:

### 19.1 Tamper-resistant financial records

Important settlement events can be recorded on-chain.

### 19.2 Shared auditability

Organizations can reference verifiable transaction history.

### 19.3 Automated settlement

A valid redemption can trigger controlled release of settlement.

### 19.4 Reduced dependence on one database

The critical financial state can have an independently verifiable representation.

---

# 20. Smart Contract Model

The initial smart contract should remain intentionally small.

Conceptual contract:

```text
AmanatAidPool

createCampaign()
fundCampaign()
createEntitlement()
redeemEntitlement()
releaseSettlement()
```

Exact function signatures are an implementation decision.

---

## 20.1 Campaign

Contains concepts such as:

- campaign ID
- target amount
- current funding
- status
- creator/authorized issuer
- metadata reference
- timestamps

---

## 20.2 Entitlement

Conceptually:

```text
entitlementId
campaignId
householdReference
allocatedAmount
remainingAmount
status
expiry
issuer
```

Sensitive household information should be represented by a non-sensitive internal reference or cryptographic representation rather than personal information.

---

## 20.3 Redemption

Conceptually:

```text
redemptionId
entitlementId
merchantId
amount
timestamp
status
```

---

## 20.4 Settlement

Once a redemption is confirmed:

```text
merchant confirmation
        ↓
validation
        ↓
smart contract
        ↓
settlement released
```

For the prototype, settlement can use testnet assets.

---

# 21. Gasless Merchant Experience

The merchant should never need to pay blockchain gas.

Architecture:

```text
Merchant PWA
     ↓
Amanat API
     ↓
Voucher validation
     ↓
Redemption validation
     ↓
Amanat relayer
     ↓
Base Sepolia
     ↓
Smart contract
```

The relayer wallet signs the blockchain transaction.

For the hackathon, a controlled server-side relayer wallet funded with Base Sepolia test ETH is acceptable for the prototype.

Production systems would require stronger key management and account abstraction/security architecture.

---

# 22. PWA Architecture

Amanat will be implemented as a **Progressive Web App**.

The PWA should support role-specific experiences.

Possible routes:

```text
/donor
/merchant
/admin
/organization
```

Beneficiaries primarily interact through:

- WhatsApp
- SMS
- voucher codes
- optionally a lightweight web page

---

# 23. Donor Experience

The donor dashboard should communicate impact clearly.

Example:

```text
Dadu Emergency Food Relief

Target              Rs. 100,000
Funded               Rs. 100,000
Households               25
Households reached       18

Redeemed              Rs. 72,000
Remaining             Rs. 28,000

Fulfillment              72%
```

A campaign should have:

- overview
- funding status
- household impact count
- redemption progress
- merchant activity
- audit/transaction references
- map if available

---

# 24. Merchant Experience

The merchant PWA should be extremely simple.

Example:

```text
AMANAT

Voucher Code

[ 4 8 2 7 ]

[ VERIFY ]
```

After verification:

```text
✓ VALID VOUCHER

Entitlement:
Rs. 4,000

Already redeemed:
Rs. 1,350

Remaining:
Rs. 2,650

Amount to fulfill:

[ Rs. 1,200 ]

[ CONFIRM FULFILLMENT ]
```

After success:

```text
✓ FULFILLMENT CONFIRMED

Rs. 1,200

Remaining:
Rs. 1,450

Settlement:
PROCESSING / CONFIRMED
```

---

# 25. Organization/Admin Experience

The organization/admin interface should support:

- campaign creation
- household registration
- verification
- entitlement issuance
- merchant management
- voucher management
- redemption monitoring
- dispute handling
- audit viewing

---

# 26. Proposed Technology Stack

## Frontend

### Next.js
Use Next.js with TypeScript.

Reasons:

- strong React ecosystem
- server/client rendering options
- API routes/Route Handlers
- easy deployment
- excellent PWA suitability
- good developer velocity

---

## UI

### Tailwind CSS

Use for styling.

### shadcn/ui

Use for reusable accessible UI components where appropriate.

The donor dashboard can be polished.

The merchant interface should prioritize usability over visual complexity.

---

# 27. PWA Technology

Use a modern Next.js-compatible PWA approach.

Requirements:

- installable manifest
- service worker
- responsive layouts
- mobile-first merchant UI
- caching of safe static assets
- offline-aware UX

Do not assume blockchain transactions can safely be finalized offline.

Offline functionality should be designed carefully around synchronization and replay protection.

---

# 28. Backend

Use:

### Next.js Route Handlers / Server Actions

There is no requirement for a separate Express backend in the initial architecture.

Benefits:

- one repository
- one deployment
- shared TypeScript types
- reduced complexity
- faster iteration

---

# 29. Database

### Supabase PostgreSQL

Use Supabase for:

- relational database
- authentication
- storage
- realtime capabilities where useful
- database APIs
- row-level security

---

# 30. Suggested Core Database Entities

Initial entities:

```text
users
organizations
merchants
households
campaigns
aid_pools
entitlements
vouchers
redemptions
settlements
audit_events
```

Possible later entities:

```text
household_verifications
aid_history
merchant_locations
notifications
disputes
emergency_events
```

---

# 31. Authentication

Use:

### Supabase Auth

Roles:

```text
DONOR
MERCHANT
ORGANIZATION
ADMIN
```

Role enforcement must exist server-side, not only in the frontend.

Use Supabase Row Level Security where appropriate.

---

# 32. Storage

Use:

### Supabase Storage

Potentially for:

- organization verification documents
- merchant documents
- household evidence
- campaign media

Sensitive documents must use appropriate access controls.

Do not make private evidence publicly accessible.

---

# 33. Blockchain Stack

### Network

**Base Sepolia**

Purpose:

- development
- demonstration
- testnet smart contracts

Do not use mainnet during the hackathon.

---

## Smart Contracts

### Solidity

Use Solidity for the Amanat contract.

### OpenZeppelin

Use OpenZeppelin contracts/libraries where appropriate for:

- access control
- security patterns
- token handling if required
- ownership/roles
- common Solidity primitives

---

## Development

### Foundry

Use Foundry for:

- contract compilation
- local testing
- deployment scripts
- unit tests
- local blockchain testing

---

## Frontend blockchain interaction

### Viem

Use Viem for low-level blockchain interaction.

### Wagmi

Use Wagmi where React wallet/client integration is useful.

The normal merchant flow should remain walletless.

---

# 34. Relayer

Initial approach:

### Amanat backend relayer wallet

Responsibilities:

- sign approved redemption/settlement transactions
- pay Base Sepolia gas
- interact with the smart contract

The private key must never be exposed to the browser.

For local development:

- use environment variables
- never commit private keys
- use a dedicated testnet wallet

Production would require a secure secret manager/HSM or equivalent architecture.

---

# 35. Messaging

Amanat should have a messaging abstraction.

```text
Voucher Notification Service
          │
     ┌────┼─────┐
     ↓    ↓     ↓
 WhatsApp SMS  Demo
```

Potential providers:

- WhatsApp Cloud API
- Twilio
- another suitable SMS/WhatsApp provider

The provider should be replaceable.

---

# 36. Demo Messaging Mode

Because external messaging APIs may introduce cost, verification, or configuration problems, the application should support a development/demo mode.

Example:

```text
Voucher generated:
4827

Notification:
SIMULATED

[Open beneficiary message]
```

This allows the entire flow to be demonstrated without requiring paid messaging.

---

# 37. Maps

Use:

### OpenStreetMap

and:

### MapLibre

Potential uses:

- merchant map
- campaign geography
- aid coverage
- future disaster/flood overlays

Avoid unnecessary dependence on paid Google Maps APIs.

---

# 38. Charts

Use:

### Recharts

for:

- funding progress
- redemption progress
- household reach
- merchant fulfillment
- campaign statistics

Charts should support clear impact communication.

---

# 39. Validation

Use:

### Zod

For:

- API input validation
- voucher payload validation
- campaign creation
- entitlement creation
- redemption requests
- server-side request validation

Never rely only on frontend validation.

---

# 40. Deployment

### Frontend/backend

Use:

**Vercel**

### Database/auth/storage

Use:

**Supabase**

### Blockchain

Use:

**Base Sepolia**

### Source control

Use:

**GitHub**

The system should be deployable as a single primary web application plus the smart contract.

---

# 41. Recommended Repository Structure

The exact structure can change if implementation requires it, but a reasonable starting point is:

```text
amanat/
│
├── app/
│   ├── donor/
│   ├── merchant/
│   ├── organization/
│   ├── admin/
│   ├── api/
│   └── ...
│
├── components/
│
├── lib/
│   ├── supabase/
│   ├── blockchain/
│   ├── vouchers/
│   ├── messaging/
│   └── validation/
│
├── contracts/
│   ├── src/
│   ├── test/
│   └── script/
│
├── public/
│
├── types/
│
├── supabase/
│   └── migrations/
│
├── tests/
│
├── .env.example
├── package.json
└── README.md
```

The implementation agent may modify this structure if it produces a cleaner architecture.

---

# 42. Core End-to-End Flow

## 42.1 Campaign Creation

An authorized organization/admin creates:

> Dadu Emergency Food Relief

with:

- title
- description
- location
- target amount
- target households
- aid category
- validity
- participating merchants

---

## 42.2 Funding

A donor chooses the campaign.

The system records the funding.

For the prototype, this can use:

- testnet transaction
- simulated donor payment
- or an explicit demo funding mode

The implementation should make it visually clear whether a transaction is real testnet activity or simulated.

---

## 42.3 Household Verification

An organization registers a household.

Example:

```text
AMN-48291
Household size: 6
Area: Dadu
Status: Verified
```

Sensitive evidence stays off-chain.

---

## 42.4 Entitlement Issuance

Organization assigns:

```text
Campaign:
Dadu Emergency Food Relief

Household:
AMN-48291

Amount:
Rs. 4,000

Validity:
30 days
```

---

## 42.5 Voucher Generation

The system generates:

- secure voucher ID
- human-friendly verification code
- expiry
- entitlement reference

The voucher is delivered through WhatsApp/SMS or demo mode.

---

## 42.6 Merchant Verification

Merchant enters/scans the voucher.

Server validates:

1. voucher exists
2. voucher is active
3. entitlement is active
4. entitlement has remaining balance
5. merchant is authorized
6. requested amount is valid
7. voucher is not expired
8. no conflicting redemption is currently being processed

---

## 42.7 Fulfillment

Merchant provides goods.

Merchant confirms the actual amount fulfilled.

---

## 42.8 Settlement

Backend sends a controlled transaction through the relayer.

Smart contract records the redemption/settlement.

---

## 42.9 Dashboard Update

Donor dashboard shows:

- redeemed amount
- remaining amount
- households reached
- redemption count
- merchant activity
- blockchain transaction reference

---

# 43. Critical Security Requirements

## Voucher security

Do not use predictable sequential voucher codes as the actual secret.

A short human-friendly code may be used as one layer, but the backend should have a cryptographically strong internal token/reference.

Use rate limiting on voucher verification.

---

## Redemption security

Prevent double redemption through:

- database transaction/locking
- idempotency keys
- smart-contract state checks
- server-side validation

---

## Authorization

Every sensitive action must be authorized server-side.

Examples:

- only organizations/admins issue entitlements
- only authorized merchants redeem them
- only authorized admins manage merchants
- donors cannot modify campaign settlement state

---

## Blockchain key security

Never expose relayer private keys in frontend code.

Never commit them to Git.

Use `.env.local` for local development.

---

# 44. Important Accounting Principle

The database and blockchain should not silently disagree.

The system should define which layer is authoritative for each piece of state.

Suggested model:

### Off-chain

Authoritative for:

- household information
- user accounts
- merchant profiles
- verification evidence
- messaging
- UI metadata

### On-chain

Authoritative for:

- recorded settlement events
- smart-contract-controlled balances
- redemption state that the contract manages

The backend should reconcile and display both appropriately.

---

# 45. Emergency Mode — Future Architecture

Amanat can eventually support emergency activation.

Example:

```text
Normal Mode
     ↓
Emergency declared
     ↓
Emergency Aid Pool
     ↓
Rapid household verification
     ↓
Emergency entitlements
     ↓
Multiple local merchants
     ↓
Aid fulfillment
     ↓
Live coverage dashboard
```

Future features could include:

- affected-area maps
- flood/disaster layers
- priority zones
- emergency merchant activation
- temporary aid hubs
- rapid entitlement issuance
- offline-aware workflows

These are future enhancements, not required for the first working MVP.

---

# 46. Future AI Layer

AI may eventually assist with:

- identifying underserved areas
- analyzing aid coverage
- recommending allocation
- detecting suspicious redemption patterns
- summarizing campaign impact
- identifying possible duplicate assistance
- disaster-response planning

But AI should not independently determine a person's worthiness for aid.

Principle:

> **AI recommends; authorized humans approve.**

---

# 47. Future Privacy Layer

Long-term Amanat may explore:

- privacy-preserving proofs
- zero-knowledge proofs
- selective disclosure
- cryptographic household credentials
- anonymous eligibility verification

Example future query:

> "Has this household received emergency food assistance above the threshold in the last 30 days?"

The system could eventually answer:

> Yes / No

without exposing the household's entire aid history.

This should not block the initial build.

---

# 48. Future Offline Architecture

Dadu/disaster environments may have:

- weak connectivity
- power interruptions
- damaged infrastructure

A future merchant system should support offline-first workflows.

However:

**Do not blindly allow offline redemption without a strong anti-double-spend mechanism.**

Possible future approaches:

- signed offline vouchers
- limited offline authorization
- local encrypted queues
- synchronization protocols
- conflict resolution
- secure redemption counters

For the initial version, offline mode can focus on safe UI/static caching and queued non-final actions.

---

# 49. MVP Definition

The first fully working Amanat MVP should prove this exact loop:

```text
Campaign
   ↓
Donor funding
   ↓
Verified household
   ↓
Entitlement
   ↓
Voucher
   ↓
Merchant
   ↓
Redemption
   ↓
Blockchain settlement
   ↓
Impact dashboard
```

If this works reliably, the core product thesis is proven.

---

# 50. MVP User Roles

The first implementation should support:

### Donor

- login
- browse campaign
- fund campaign
- view campaign impact

### Organization/Admin

- create campaign
- register household
- issue entitlement
- generate voucher
- register/approve merchant

### Merchant

- login
- verify voucher
- enter redemption amount
- confirm fulfillment
- see remaining entitlement

### Beneficiary

- receive/view voucher
- redeem through merchant

---

# 51. MVP Demonstration Scenario

Use a fictional but realistic Dadu scenario.

Example:

> **Dadu Emergency Food Relief**

Campaign:

```text
Target:
Rs. 100,000

Households:
25

Participating merchants:
3
```

Donor funds:

```text
Rs. 100,000
```

Household:

```text
AMN-48291
Entitlement:
Rs. 4,000
```

Voucher:

```text
4827
```

Merchant redeems:

```text
Rs. 1,200
```

Remaining:

```text
Rs. 2,800
```

Blockchain settlement occurs.

Dashboard updates:

```text
25 households
1+ redeemed
Rs. 1,200 fulfilled
Rs. 98,800 remaining
```

The exact demo numbers can be changed.

---

# 52. Detailed Build Phases

The following phases should be implemented sequentially.

---

## PHASE 0 — Project Initialization

### Goal

Create the base project and development environment.

### Tasks

1. Create Git repository.
2. Initialize Next.js with TypeScript.
3. Configure Tailwind.
4. Configure shadcn/ui.
5. Configure linting/formatting.
6. Create `.env.example`.
7. Create initial route structure.
8. Add basic PWA configuration.
9. Create a basic landing page.
10. Confirm local development works.

### Deliverable

A running installable-capable Next.js PWA shell.

---

# PHASE 1 — Product Shell & Design System

### Goal

Create the visual foundation.

### Tasks

1. Define Amanat branding.
2. Create typography hierarchy.
3. Create buttons.
4. Create cards.
5. Create badges/status indicators.
6. Create forms.
7. Create navigation.
8. Create responsive mobile layouts.
9. Create donor dashboard shell.
10. Create merchant dashboard shell.
11. Create organization/admin shell.

### Design principle

Do not make every screen look like a generic SaaS dashboard.

Merchant UI should prioritize:

- large buttons
- clear status
- minimal text
- strong contrast
- touch-friendly controls

Donor UI can be more information-rich.

---

# PHASE 2 — Supabase Setup

### Goal

Create the off-chain data layer.

### Tasks

1. Create Supabase project.
2. Configure environment variables.
3. Configure authentication.
4. Create database schema.
5. Create tables.
6. Create relationships.
7. Add indexes.
8. Configure Row Level Security.
9. Add seed/demo data.
10. Configure storage buckets where needed.

### Initial schema

At minimum:

```text
users
organizations
merchants
households
campaigns
entitlements
vouchers
redemptions
settlements
audit_events
```

### Deliverable

Database-backed application with working authentication and role handling.

---

# PHASE 3 — Authentication & Roles

### Goal

Create real role-specific access.

### Tasks

1. Implement login.
2. Implement logout.
3. Create role model.
4. Add route protection.
5. Add server-side authorization.
6. Configure RLS.
7. Create demo users.

Demo users:

```text
donor@example.com
merchant@example.com
admin@example.com
organization@example.com
```

Use safe demo credentials only.

### Deliverable

Each role sees only its appropriate experience.

---

# PHASE 4 — Campaign System

### Goal

Implement aid campaigns/pools.

### Tasks

1. Campaign creation form.
2. Campaign list.
3. Campaign details.
4. Target funding.
5. Current funding.
6. Campaign status.
7. Location.
8. Aid category.
9. Target households.
10. Merchant participation.

### Donor features

- browse campaigns
- inspect campaign
- see progress
- initiate funding

### Deliverable

A complete off-chain campaign management system.

---

# PHASE 5 — Household & Entitlement System

### Goal

Create the core aid allocation mechanism.

### Tasks

1. Household registration.
2. Amanat Household ID generation.
3. Verification status.
4. Organization/admin household view.
5. Entitlement creation.
6. Entitlement balance.
7. Expiry.
8. Status management.
9. Aid history.
10. Campaign association.

### Deliverable

An organization can create:

```text
Household
   ↓
Entitlement
   ↓
Rs. 4,000
```

---

# PHASE 6 — Voucher System

### Goal

Turn entitlements into redeemable beneficiary vouchers.

### Tasks

1. Generate secure voucher ID.
2. Generate human-friendly code.
3. Associate voucher with entitlement.
4. Add expiry.
5. Add status.
6. Build beneficiary message.
7. Build voucher lookup.
8. Add verification endpoint.
9. Add rate limiting.
10. Add invalid/expired/redeemed states.

### Deliverable

A real voucher can be generated and verified.

---

# PHASE 7 — Merchant Redemption

### Goal

Implement the most important physical-world interaction.

### Tasks

1. Merchant login.
2. Voucher entry.
3. Voucher validation.
4. Show entitlement balance.
5. Enter fulfillment amount.
6. Validate amount.
7. Confirm fulfillment.
8. Record redemption.
9. Update remaining balance.
10. Prevent double redemption.
11. Show success receipt.

### Deliverable

A merchant can complete a genuine redemption transaction.

---

# PHASE 8 — Smart Contract

### Goal

Implement blockchain settlement.

### Tasks

1. Initialize Foundry project.
2. Configure Base Sepolia.
3. Add OpenZeppelin dependencies.
4. Implement contract.
5. Implement roles.
6. Implement campaign/funding state.
7. Implement entitlement state as appropriate.
8. Implement redemption/settlement state.
9. Write unit tests.
10. Deploy to local test chain.
11. Deploy to Base Sepolia.
12. Verify contract if appropriate.

### Deliverable

A working Base Sepolia contract with tests.

---

# PHASE 9 — Backend Relayer

### Goal

Allow merchants to settle without wallets.

### Tasks

1. Create dedicated Base Sepolia relayer wallet.
2. Fund with testnet ETH.
3. Store private key securely in environment.
4. Create server-side blockchain client.
5. Implement transaction submission.
6. Implement transaction status handling.
7. Save transaction hash.
8. Handle failures.
9. Prevent duplicate transaction submission.
10. Reconcile blockchain result with database state.

### Deliverable

Merchant presses:

> Confirm Fulfillment

and the backend sends the blockchain transaction.

---

# PHASE 10 — Donor Impact Dashboard

### Goal

Make the transparency/impact proposition visible.

### Dashboard should show

- campaign funding
- households
- entitlements
- redeemed amount
- remaining amount
- fulfillment rate
- merchant activity
- recent redemptions
- transaction references

Example:

```text
Dadu Emergency Food Relief

Funding
████████████████████ 100%

Rs. 100,000 funded

25 households
18 reached

Rs. 72,000 redeemed

72% fulfilled
```

---

# PHASE 11 — WhatsApp/SMS Integration

### Goal

Deliver vouchers to beneficiaries.

### Tasks

1. Create notification service abstraction.
2. Implement demo provider.
3. Add WhatsApp provider if credentials are available.
4. Add SMS provider if appropriate.
5. Generate message.
6. Send voucher.
7. Record notification status.
8. Handle failures.

### Important

The core application must work without an external messaging provider.

---

# PHASE 12 — Maps

### Goal

Make the local nature of Amanat visible.

### Tasks

1. Add MapLibre.
2. Add OpenStreetMap tiles/provider.
3. Display merchant locations.
4. Display campaign area.
5. Show aid coverage.
6. Add merchant markers.
7. Add simple statistics.

Do not overbuild the geographic system at first.

---

# PHASE 13 — PWA & Mobile Hardening

### Goal

Make Amanat feel like a real installable application.

### Tasks

1. Manifest.
2. Icons.
3. Service worker.
4. Static asset caching.
5. Mobile viewport testing.
6. Install prompt/UX where appropriate.
7. Touch target testing.
8. Slow-network testing.
9. Merchant workflow testing on phone.
10. Handle connection loss gracefully.

---

# PHASE 14 — Security & Abuse Testing

### Test cases

### Voucher

- invalid voucher
- expired voucher
- already redeemed voucher
- excessive attempts
- invalid amount

### Authorization

- donor accessing admin endpoint
- merchant accessing organization endpoint
- organization accessing unrelated private records
- unauthenticated API calls

### Redemption

- double click
- simultaneous redemption
- redemption above balance
- redemption after expiry
- merchant not assigned to campaign

### Blockchain

- failed transaction
- transaction timeout
- duplicate submission
- relayer failure
- contract rejection

### Database

- RLS violations
- unauthorized reads
- unauthorized updates

---

# PHASE 15 — Full End-to-End Testing

Perform the exact flow:

```text
Admin
 ↓
Create Dadu campaign

Donor
 ↓
Fund campaign

Organization
 ↓
Register household

Organization
 ↓
Issue Rs. 4,000 entitlement

System
 ↓
Generate voucher

Beneficiary
 ↓
Receives voucher

Merchant
 ↓
Enters voucher

Merchant
 ↓
Confirms Rs. 1,200 fulfillment

Backend
 ↓
Relayer submits blockchain transaction

Base Sepolia
 ↓
Settlement recorded

Amanat
 ↓
Dashboard updated
```

This flow must work without manual database edits.

---

# PHASE 16 — Deployment

### Tasks

1. Deploy Next.js to Vercel.
2. Configure production environment variables.
3. Configure Supabase production project.
4. Configure Base Sepolia contract address.
5. Configure relayer.
6. Configure messaging if available.
7. Test production database.
8. Test PWA installation.
9. Test merchant on mobile.
10. Test donor on desktop/mobile.
11. Confirm blockchain transaction.
12. Create demo data.

---

# PHASE 17 — Demo Preparation

Prepare a deterministic demo environment.

### Demo setup

Campaign:

> Dadu Emergency Food Relief

Merchants:

- Store A
- Store B
- Store C

Households:

- at least 5–10 demo households

Donor:

- demo donor account

Organization:

- demo organization account

Merchant:

- demo merchant account

---

## Demo sequence

### Scene 1 — Problem

Explain:

> Aid can be funded without creating a clear, verifiable path to actual household-level fulfillment.

### Scene 2 — Campaign

Create/show:

> Dadu Emergency Food Relief

### Scene 3 — Funding

Fund:

> Rs. 100,000

### Scene 4 — Entitlement

Show:

> Household AMN-48291 → Rs. 4,000

### Scene 5 — Beneficiary

Show generated WhatsApp/SMS voucher.

### Scene 6 — Merchant

Enter:

> 4827

### Scene 7 — Fulfillment

Redeem:

> Rs. 1,200

### Scene 8 — Blockchain

Show:

> Settlement transaction recorded on Base Sepolia.

### Scene 9 — Impact

Dashboard changes:

```text
Households reached: 1

Redeemed:
Rs. 1,200

Remaining:
Rs. 98,800
```

This demonstrates the entire Amanat loop.

---

# 53. Product Metrics

The system should eventually measure:

## Funding

- total funded
- funding rate
- campaign target

## Reach

- households verified
- households entitled
- households reached

## Fulfillment

- total redeemed
- average redemption
- redemption rate
- unredeemed entitlements

## Merchant network

- active merchants
- transactions per merchant
- geographic coverage

## Aid coordination

Future:

- duplicate assistance prevented
- organizations participating
- aid categories
- time from entitlement to redemption

---

# 54. What Makes Amanat Valuable

The core value proposition is not:

> "We use blockchain."

It is:

> **Amanat creates a traceable path between aid funding and real-world assistance.**

For the donor:

> "I can see whether my contribution translated into actual fulfillment."

For the organization:

> "I can issue and track household entitlements."

For the merchant:

> "I can fulfill assistance and receive settlement without handling crypto."

For the beneficiary:

> "I can receive essential goods privately and locally."

For the broader aid ecosystem:

> "Different actors can coordinate without relying entirely on disconnected spreadsheets and opaque manual records."

---

# 55. What Makes It Specifically Relevant to Dadu

Amanat should emphasize:

- recurring disaster exposure
- flood vulnerability
- local economic networks
- need for rapid household assistance
- challenges of physical distribution during crises
- importance of local access
- dignity of beneficiaries
- need for transparent aid coordination

Do not claim that Amanat will eliminate corruption or fraud.

Instead claim:

> **Amanat makes the allocation, redemption, and settlement chain more observable and verifiable.**

---

# 56. Long-Term Vision

The long-term vision is not merely:

> "A better ration voucher."

It is:

> **A persistent local humanitarian infrastructure network that is already embedded in communities before disaster strikes.**

Normal period:

```text
Zakat
Food assistance
Medical aid
Education
Community welfare
```

Emergency:

```text
Flood
Displacement
Food crisis
Climate event
```

Recovery:

```text
Rebuilding assistance
Household recovery
Local economic support
```

The same infrastructure supports all three phases.

---

# 57. Potential Future Expansion Across Pakistan

After proving the model in Dadu, Amanat could expand to other disaster-prone or underserved areas.

The geographic model should remain modular.

Potential future capabilities:

- city-specific aid networks
- cross-city campaigns
- national NGO integrations
- diaspora funding
- corporate CSR
- Zakat infrastructure
- government relief integration
- disaster-response coordination
- privacy-preserving national aid identity

The initial product should remain Dadu-focused.

---

# 58. Important Engineering Principles

The implementation agent should follow these principles:

1. **Build the core loop first.**
2. Do not over-engineer microservices.
3. Keep sensitive data off-chain.
4. Never expose private keys to clients.
5. Do not require beneficiaries to use crypto.
6. Do not require merchants to use wallets.
7. Keep blockchain interactions server-controlled where possible.
8. Validate every financial action server-side.
9. Make redemption idempotent.
10. Design for mobile first.
11. Keep the messaging provider replaceable.
12. Make the system functional even when external messaging is unavailable.
13. Use testnet only for the hackathon.
14. Do not fake blockchain activity when a real testnet transaction can be demonstrated.
15. Clearly distinguish simulated/demo actions from real testnet transactions.
16. Do not store sensitive beneficiary information on-chain.
17. Do not let AI autonomously determine aid eligibility.
18. Prefer simple architecture that can be understood and demonstrated.
19. Keep future features modular instead of blocking the MVP.
20. Prioritize a complete end-to-end flow over a large number of disconnected features.

---

# 59. MVP Priority Order

If implementation time becomes constrained, prioritize in exactly this order:

### P0 — Absolutely required

1. Next.js PWA
2. Supabase database
3. Authentication/roles
4. Campaign
5. Household
6. Entitlement
7. Voucher
8. Merchant verification
9. Redemption
10. Blockchain settlement
11. Donor impact dashboard

### P1 — Strong additions

12. Demo WhatsApp/SMS
13. Merchant map
14. Realtime dashboard updates
15. Better audit timeline
16. QR-based voucher

### P2 — Future / optional

17. Real WhatsApp automation
18. Offline workflows
19. Disaster map layers
20. AI allocation assistance
21. duplicate-aid detection
22. privacy-preserving proofs
23. Aid Passport
24. multi-organization coordination
25. advanced analytics

Do not sacrifice P0 functionality for P2 features.

---

# 60. CLI Agent Instructions

When using this document as context, the coding agent should follow these rules:

1. Read the entire document before making architectural decisions.
2. Build incrementally according to the phases.
3. Do not generate the whole project blindly in one pass.
4. Inspect the existing repository before creating or replacing files.
5. Preserve working code.
6. Prefer simple architecture over unnecessary services.
7. Use free/open-source/free-tier services whenever practical.
8. Do not introduce a dependency without a clear reason.
9. Keep blockchain responsibilities narrow.
10. Never expose sensitive beneficiary information on-chain.
11. Never expose private keys to the client.
12. Never use real beneficiary data in development.
13. Use synthetic Dadu households for demonstration.
14. Implement strong authorization and validation.
15. Treat merchant redemption as a financially sensitive operation.
16. Prevent double redemption at both application and smart-contract layers.
17. Keep the beneficiary experience extremely simple.
18. Keep merchant UX mobile-first and low-literacy friendly.
19. Do not make crypto knowledge a requirement for merchants or beneficiaries.
20. Build the end-to-end core flow before adding advanced features.
21. Keep external integrations abstracted so the application remains usable if WhatsApp/SMS credentials are unavailable.
22. Document setup requirements and environment variables.
23. Add tests for critical business logic.
24. Never silently weaken security for convenience.
25. If a proposed feature conflicts with privacy, dignity, or the core Amanat model, flag it before implementing it.
26. If an implementation decision is ambiguous, prefer the simplest design that preserves the product principles.
27. Do not treat the technology stack as immutable if a clearly better free/open-source option is discovered, but explain the reason for changing it before doing so.
28. Keep the application deployable as a PWA throughout development.


# 61. Final Product Definition

At its core, Amanat is:

```text
                 AMANAT
       LOCAL AID INFRASTRUCTURE
                    │
          ┌─────────┴─────────┐
          │                   │
   COMMUNITY MODE       EMERGENCY MODE
          │                   │
     Zakat / Food         Flood Relief
     Medical Aid          Displacement
     Education            Crisis Aid
          │                   │
          └─────────┬─────────┘
                    ↓
             VERIFIED HOUSEHOLDS
                    ↓
              AID ENTITLEMENTS
                    ↓
                FUNDING POOLS
                    ↓
             LOCAL MERCHANTS
                    ↓
                REDEMPTION
                    ↓
                SETTLEMENT
                    ↓
             AUDIT / IMPACT
```

The central promise is:

> **From entrusted money to actual assistance — with a verifiable trail.**

---


# 62. Final Build Philosophy

Do not build Amanat as a collection of blockchain features.

Build it as a believable system that could exist in Dadu.

A donor should be able to fund help.

An authorized organization should be able to identify and support a household.

A household should be able to receive that assistance without learning anything about blockchain.

A local shopkeeper should be able to fulfill it with a simple phone.

The system should settle the transaction.

And the donor should be able to look back and understand:

> **Where did the aid go?**

That is the product.

Everything else is supporting infrastructure.

