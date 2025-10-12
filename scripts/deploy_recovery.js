// scripts/deploy_recovery.js
const hre = require("hardhat");

async function main() {
  console.log("Deploying Identity contract...");
  const identityContract = await hre.ethers.deployContract("Identity");
  await identityContract.waitForDeployment();
  const identityAddress = identityContract.target;
  console.log(`✅ Identity contract deployed to: ${identityAddress}`);

  // --- Deploy SocialRecovery Contract ---
  // Define guardians and threshold for recovery
  const [owner] = await hre.ethers.getSigners();
  const guardians = [
    // Add at least one guardian address. For testing, you can use another
    // account from your Hardhat environment or a different MetaMask account.
    process.env.METAMASK_WALLET_ADDRESS, // Replace with Guardian 1 Address
    process.env.METAMASK_WALLET_ADDRESS1, // Replace with Guardian 2 Address
  ];
  const threshold = 2; // Requires 2 out of 2 guardians to approve recovery

  console.log("\nDeploying SocialRecovery contract...");
  const socialRecoveryContract = await hre.ethers.deployContract("SocialRecovery", [
    identityAddress,
    guardians,
    threshold,
  ]);
  await socialRecoveryContract.waitForDeployment();
  const recoveryAddress = socialRecoveryContract.target;
  console.log(`✅ SocialRecovery contract deployed to: ${recoveryAddress}`);

  // --- Transfer Ownership of Identity Contract ---
  console.log("\nTransferring ownership of Identity contract to SocialRecovery contract...");
  const tx = await identityContract.transferOwnership(recoveryAddress);
  await tx.wait();
  console.log("✅ Ownership transferred successfully.");
  console.log(`\n--- Deployment Summary ---`);
  console.log(`Identity Contract: ${identityAddress}`);
  console.log(`SocialRecovery Contract: ${recoveryAddress}`);
  console.log(`Next Step: Update your client/.env file with these addresses.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});