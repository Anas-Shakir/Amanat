// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/AmanatAidPool.sol";

contract AmanatAidPoolTest {
    AmanatAidPool pool;
    address admin = address(this);
    address relayer = address(0x1111111111111111111111111111111111111111);
    address merchant = address(0x2222222222222222222222222222222222222222);

    function setUp() public {
        pool = new AmanatAidPool(admin, relayer);
    }

    function testCreateCampaign() public {
        pool.createCampaign(1, 100000, "ipfs://QmDaduFloodEmergencyRelief");
        (
            uint256 id,
            uint256 targetAmount,
            uint256 totalFunded,
            uint256 totalRedeemed,
            bool isActive,
            address issuer,
            string memory metadataURI
        ) = pool.getCampaign(1);

        require(id == 1, "ID should be 1");
        require(targetAmount == 100000, "Target should be 100000");
        require(isActive == true, "Should be active");
        require(issuer == admin, "Issuer should be admin");
    }

    function testCreateAndRedeemEntitlement() public {
        pool.createCampaign(1, 100000, "ipfs://dadu");
        bytes32 entHash = keccak256(abi.encodePacked("AMN-48291_secret_salt"));
        pool.createEntitlement(1, entHash, 4000);

        (
            uint256 campaignId,
            uint256 allocatedAmount,
            uint256 remainingAmount,
            bool exists
        ) = pool.getEntitlement(entHash);

        require(exists == true, "Should exist");
        require(allocatedAmount == 4000, "Allocated should be 4000");
        require(remainingAmount == 4000, "Remaining should be 4000");
    }
}
