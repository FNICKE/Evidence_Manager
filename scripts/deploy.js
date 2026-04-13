const hre = require("hardhat");

async function main() {
  const EvidenceManager = await hre.ethers.deployContract("EvidenceManager");

  await EvidenceManager.waitForDeployment();

  console.log(
    `EvidenceManager deployed to ${EvidenceManager.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
