// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AmanatAidPool
 * @notice Verifiable Local Aid Infrastructure Smart Contract for Dadu, Sindh.
 * @dev Manages aid campaigns, cryptographic entitlement allocations, and gasless merchant settlements.
 */
contract AmanatAidPool is AccessControl, ReentrancyGuard {
    // --- Roles ---
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    // --- Data Structures ---
    struct Campaign {
        uint256 id;
        uint256 targetAmount; // In PKR equivalent or wei units
        uint256 totalFunded;
        uint256 totalRedeemed;
        bool isActive;
        address issuer;
        string metadataURI; // IPFS / Supabase reference (no PII)
    }

    struct Entitlement {
        uint256 campaignId;
        uint256 allocatedAmount;
        uint256 remainingAmount;
        bool exists;
    }

    // --- State Variables ---
    mapping(uint256 => Campaign) public campaigns;
    mapping(bytes32 => Entitlement) public entitlements;

    uint256 public totalCampaigns;
    uint256 public totalSettledAmount;

    // --- Events ---
    event CampaignCreated(
        uint256 indexed campaignId,
        uint256 targetAmount,
        address indexed issuer,
        string metadataURI
    );

    event CampaignFunded(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        uint256 newTotalFunded
    );

    event EntitlementCreated(
        uint256 indexed campaignId,
        bytes32 indexed entitlementHash,
        uint256 allocatedAmount
    );

    event EntitlementRedeemed(
        uint256 indexed campaignId,
        bytes32 indexed entitlementHash,
        address indexed merchant,
        uint256 amountRedeemed,
        uint256 remainingAmount
    );

    event SettlementReleased(
        uint256 indexed campaignId,
        address indexed merchant,
        uint256 amount
    );

    /**
     * @notice Constructor initializes default admin and relayer roles
     * @param adminAddress The contract administrator
     * @param initialRelayer The backend relayer wallet that broadcasts gasless merchant transactions
     */
    constructor(address adminAddress, address initialRelayer) {
        require(adminAddress != address(0), "Invalid admin");
        require(initialRelayer != address(0), "Invalid relayer");

        _grantRole(DEFAULT_ADMIN_ROLE, adminAddress);
        _grantRole(RELAYER_ROLE, initialRelayer);
        _grantRole(ISSUER_ROLE, adminAddress);
    }

    // --- External Functions ---

    /**
     * @notice Creates a new aid campaign / pool on-chain
     * @param campaignId Unique campaign ID
     * @param targetAmount Target funding amount
     * @param metadataURI Off-chain metadata URI (containing non-PII details)
     */
    function createCampaign(
        uint256 campaignId,
        uint256 targetAmount,
        string calldata metadataURI
    ) external onlyRole(ISSUER_ROLE) {
        require(campaigns[campaignId].id == 0, "Campaign already exists");
        require(targetAmount > 0, "Target must be positive");

        campaigns[campaignId] = Campaign({
            id: campaignId,
            targetAmount: targetAmount,
            totalFunded: 0,
            totalRedeemed: 0,
            isActive: true,
            issuer: msg.sender,
            metadataURI: metadataURI
        });

        totalCampaigns++;

        emit CampaignCreated(campaignId, targetAmount, msg.sender, metadataURI);
    }

    /**
     * @notice Allows donors to fund an aid pool directly with test ETH
     * @param campaignId ID of the campaign to fund
     */
    function fundCampaign(uint256 campaignId) external payable nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.isActive, "Campaign is not active");
        require(msg.value > 0, "Must send value");

        campaign.totalFunded += msg.value;

        emit CampaignFunded(campaignId, msg.sender, msg.value, campaign.totalFunded);
    }

    /**
     * @notice Creates an aid entitlement for a verified household
     * @dev Zero PII is passed. `entitlementHash` is keccak256(householdCode + secretSalt)
     * @param campaignId Campaign the entitlement draws from
     * @param entitlementHash Cryptographic identifier of the household entitlement
     * @param allocatedAmount Value of the food entitlement
     */
    function createEntitlement(
        uint256 campaignId,
        bytes32 entitlementHash,
        uint256 allocatedAmount
    ) external onlyRole(ISSUER_ROLE) {
        require(campaigns[campaignId].isActive, "Campaign not active");
        require(!entitlements[entitlementHash].exists, "Entitlement exists");
        require(allocatedAmount > 0, "Amount must be positive");

        entitlements[entitlementHash] = Entitlement({
            campaignId: campaignId,
            allocatedAmount: allocatedAmount,
            remainingAmount: allocatedAmount,
            exists: true
        });

        emit EntitlementCreated(campaignId, entitlementHash, allocatedAmount);
    }

    /**
     * @notice Gasless merchant redemption executed by authorized relayer
     * @param campaignId Campaign identifier
     * @param entitlementHash Entitlement cryptographic hash
     * @param amount Amount of goods provided by merchant
     * @param merchantAddress Settlement address of the kiryana store
     */
    function redeemEntitlement(
        uint256 campaignId,
        bytes32 entitlementHash,
        uint256 amount,
        address payable merchantAddress
    ) external onlyRole(RELAYER_ROLE) nonReentrant {
        Entitlement storage entitlement = entitlements[entitlementHash];
        require(entitlement.exists, "Entitlement does not exist");
        require(entitlement.campaignId == campaignId, "Campaign mismatch");
        require(amount > 0, "Amount must be positive");
        require(amount <= entitlement.remainingAmount, "Exceeds remaining balance");
        require(merchantAddress != address(0), "Invalid merchant address");

        Campaign storage campaign = campaigns[campaignId];
        require(campaign.isActive, "Campaign is inactive");

        // Decrement balance
        entitlement.remainingAmount -= amount;
        campaign.totalRedeemed += amount;
        totalSettledAmount += amount;

        // If contract holds pool funds and amount <= balance, disburse funds directly
        if (address(this).balance >= amount) {
            (bool success, ) = merchantAddress.call{value: amount}("");
            require(success, "Settlement transfer failed");
            emit SettlementReleased(campaignId, merchantAddress, amount);
        }

        emit EntitlementRedeemed(
            campaignId,
            entitlementHash,
            merchantAddress,
            amount,
            entitlement.remainingAmount
        );
    }

    /**
     * @notice Releases manual settlement reimbursement to a merchant
     */
    function releaseSettlement(
        uint256 campaignId,
        address payable merchantAddress,
        uint256 amount
    ) external onlyRole(RELAYER_ROLE) nonReentrant {
        require(merchantAddress != address(0), "Invalid merchant");
        require(address(this).balance >= amount, "Insufficient pool balance");

        (bool success, ) = merchantAddress.call{value: amount}("");
        require(success, "Transfer failed");

        emit SettlementReleased(campaignId, merchantAddress, amount);
    }

    // --- View Helpers ---

    function getCampaign(uint256 campaignId)
        external
        view
        returns (
            uint256 id,
            uint256 targetAmount,
            uint256 totalFunded,
            uint256 totalRedeemed,
            bool isActive,
            address issuer,
            string memory metadataURI
        )
    {
        Campaign memory c = campaigns[campaignId];
        return (
            c.id,
            c.targetAmount,
            c.totalFunded,
            c.totalRedeemed,
            c.isActive,
            c.issuer,
            c.metadataURI
        );
    }

    function getEntitlement(bytes32 entitlementHash)
        external
        view
        returns (
            uint256 campaignId,
            uint256 allocatedAmount,
            uint256 remainingAmount,
            bool exists
        )
    {
        Entitlement memory e = entitlements[entitlementHash];
        return (e.campaignId, e.allocatedAmount, e.remainingAmount, e.exists);
    }

    // Fallback receive to accept direct pool donations
    receive() external payable {}
}
