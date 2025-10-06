const hre = require("hardhat");

async function main() {
  console.log("Deploying Identity contract...");
  const identityContract = await hre.ethers.deployContract("Identity");

  await identityContract.waitForDeployment();

  console.log(`Identity contract deployed to: ${identityContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});