// scripts/add_issuer.js
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const credentialRegistryAddress = process.env.CREDENTIAL_REGISTRY_ADDRESS;
  const issuerWalletAddress = process.env.METAMASK_WALLET_ADDRESS;
  const issuerName = "DecentraID Issuer"; 

  if (!credentialRegistryAddress) {
    console.error("VITE_CREDENTIAL_REGISTRY_ADDRESS is not set in your .env file.");
    process.exit(1);
  }
   if (!issuerWalletAddress || !issuerWalletAddress.startsWith('0x')) {
    console.error("Please replace 'YOUR_METAMASK_WALLET_ADDRESS' with your actual wallet address.");
    process.exit(1);
  }

  console.log(`Attaching to CredentialRegistry contract at: ${credentialRegistryAddress}`);
  const credentialRegistry = await hre.ethers.getContractAt("CredentialRegistry", credentialRegistryAddress);

  console.log(`Adding address ${issuerWalletAddress} as an issuer with name "${issuerName}"...`);
  
  const tx = await credentialRegistry.addIssuer(issuerWalletAddress, issuerName);
  
  console.log("Transaction sent! Waiting for confirmation...");
  await tx.wait();

  console.log(`✅ Success! ${issuerWalletAddress} is now registered as an issuer.`);
  console.log(`Transaction hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});