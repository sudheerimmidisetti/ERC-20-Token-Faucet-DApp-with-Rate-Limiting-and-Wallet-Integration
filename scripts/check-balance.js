const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("--------------------------------------------------");
  console.log("Hardhat is using address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Hardhat sees balance:    ", hre.ethers.formatEther(balance), "ETH");
  console.log("--------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});