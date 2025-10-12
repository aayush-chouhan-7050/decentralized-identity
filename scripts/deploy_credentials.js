const hre = require("hardhat");

async function main() {
  console.log("Deploying CredentialRegistry contract...");
  const credentialRegistryContract = await hre.ethers.deployContract("CredentialRegistry");

  await credentialRegistryContract.waitForDeployment();

  console.log(`CredentialRegistry contract deployed to: ${credentialRegistryContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});