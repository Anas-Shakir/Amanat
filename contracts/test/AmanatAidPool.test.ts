import { expect } from "chai";
import { ethers } from "hardhat";

describe("AmanatAidPool Smart Contract", function () {
  let amanatPool: any;
  let admin: any;
  let relayer: any;
  let merchant: any;
  let donor: any;
  let unauthorized: any;

  beforeEach(async function () {
    [admin, relayer, merchant, donor, unauthorized] = await ethers.getSigners();

    const AmanatAidPoolFactory = await ethers.getContractFactory("AmanatAidPool");
    amanatPool = await AmanatAidPoolFactory.deploy(admin.address, relayer.address);
    await amanatPool.waitForDeployment();
  });

  it("Should assign initial admin and relayer roles correctly", async function () {
    const DEFAULT_ADMIN_ROLE = await amanatPool.DEFAULT_ADMIN_ROLE();
    const RELAYER_ROLE = await amanatPool.RELAYER_ROLE();
    const ISSUER_ROLE = await amanatPool.ISSUER_ROLE();

    expect(await amanatPool.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
    expect(await amanatPool.hasRole(RELAYER_ROLE, relayer.address)).to.be.true;
    expect(await amanatPool.hasRole(ISSUER_ROLE, admin.address)).to.be.true;
    expect(await amanatPool.hasRole(RELAYER_ROLE, unauthorized.address)).to.be.false;
  });

  it("Should allow authorized issuer to create a campaign", async function () {
    const campaignId = 1;
    const targetAmount = ethers.parseEther("1.0"); // 1 ETH or equivalent unit
    const metadataURI = "ipfs://QmDaduFloodEmergencyRelief";

    await expect(amanatPool.connect(admin).createCampaign(campaignId, targetAmount, metadataURI))
      .to.emit(amanatPool, "CampaignCreated")
      .withArgs(campaignId, targetAmount, admin.address, metadataURI);

    const campaign = await amanatPool.getCampaign(campaignId);
    expect(campaign.id).to.equal(campaignId);
    expect(campaign.targetAmount).to.equal(targetAmount);
    expect(campaign.isActive).to.be.true;
  });

  it("Should allow donor to fund an active campaign", async function () {
    const campaignId = 1;
    await amanatPool.connect(admin).createCampaign(campaignId, ethers.parseEther("2.0"), "ipfs://dadu");

    const donation = ethers.parseEther("0.5");
    await expect(amanatPool.connect(donor).fundCampaign(campaignId, { value: donation }))
      .to.emit(amanatPool, "CampaignFunded")
      .withArgs(campaignId, donor.address, donation, donation);

    const campaign = await amanatPool.getCampaign(campaignId);
    expect(campaign.totalFunded).to.equal(donation);
  });

  it("Should execute complete entitlement allocation and partial redemption loop", async function () {
    const campaignId = 1;
    await amanatPool.connect(admin).createCampaign(campaignId, ethers.parseEther("2.0"), "ipfs://dadu");

    // Cryptographic hash of household code AMN-48291
    const entitlementHash = ethers.keccak256(ethers.toUtf8Bytes("AMN-48291_secret_salt_123"));
    const allocatedAmount = 4000;

    // 1. Create Entitlement
    await expect(amanatPool.connect(admin).createEntitlement(campaignId, entitlementHash, allocatedAmount))
      .to.emit(amanatPool, "EntitlementCreated")
      .withArgs(campaignId, entitlementHash, allocatedAmount);

    // 2. Partial Redemption by Relayer
    const redeemAmount1 = 1200;
    await expect(
      amanatPool.connect(relayer).redeemEntitlement(campaignId, entitlementHash, redeemAmount1, merchant.address)
    )
      .to.emit(amanatPool, "EntitlementRedeemed")
      .withArgs(campaignId, entitlementHash, merchant.address, redeemAmount1, 2800);

    let ent = await amanatPool.getEntitlement(entitlementHash);
    expect(ent.remainingAmount).to.equal(2800);

    // 3. Second Partial Redemption
    const redeemAmount2 = 1800;
    await expect(
      amanatPool.connect(relayer).redeemEntitlement(campaignId, entitlementHash, redeemAmount2, merchant.address)
    )
      .to.emit(amanatPool, "EntitlementRedeemed")
      .withArgs(campaignId, entitlementHash, merchant.address, redeemAmount2, 1000);

    ent = await amanatPool.getEntitlement(entitlementHash);
    expect(ent.remainingAmount).to.equal(1000);
  });

  it("Should reject redemption exceeding remaining balance", async function () {
    const campaignId = 1;
    await amanatPool.connect(admin).createCampaign(campaignId, ethers.parseEther("2.0"), "ipfs://dadu");

    const entitlementHash = ethers.keccak256(ethers.toUtf8Bytes("AMN-48292_salt"));
    await amanatPool.connect(admin).createEntitlement(campaignId, entitlementHash, 4000);

    await expect(
      amanatPool.connect(relayer).redeemEntitlement(campaignId, entitlementHash, 5000, merchant.address)
    ).to.be.revertedWith("Exceeds remaining balance");
  });

  it("Should prevent unauthorized callers from redeeming entitlements", async function () {
    const campaignId = 1;
    await amanatPool.connect(admin).createCampaign(campaignId, ethers.parseEther("2.0"), "ipfs://dadu");
    const entitlementHash = ethers.keccak256(ethers.toUtf8Bytes("AMN-48293_salt"));
    await amanatPool.connect(admin).createEntitlement(campaignId, entitlementHash, 4000);

    await expect(
      amanatPool.connect(unauthorized).redeemEntitlement(campaignId, entitlementHash, 1000, merchant.address)
    ).to.be.reverted;
  });
});
