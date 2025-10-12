// scripts/deploy_requests.js
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const credentialRegistryAddress = process.env.CREDENTIAL_REGISTRY_ADDRESS;
  if (!credentialRegistryAddress) {
    console.error("CREDENTIAL_REGISTRY_ADDRESS is not set in your .env file.");
    process.exit(1);
  }

  console.log("Deploying CredentialRequest contract...");
  const credentialRequestContract = await hre.ethers.deployContract("CredentialRequest", [credentialRegistryAddress]);

  await credentialRequestContract.waitForDeployment();

  console.log(`CredentialRequest contract deployed to: ${credentialRequestContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});