const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // 1. Deploy Token
  const token = await hre.ethers.deployContract("FaucetToken");
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log(`Token deployed to: ${tokenAddress}`);

  // 2. Deploy Faucet
  const faucet = await hre.ethers.deployContract("TokenFaucet", [tokenAddress]);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log(`Faucet deployed to: ${faucetAddress}`);

  // 3. Grant Minter Role to Faucet
  // This is crucial: The faucet needs permission to mint new tokens
  const MINTER_ROLE = await token.MINTER_ROLE();
  const tx = await token.grantRole(MINTER_ROLE, faucetAddress);
  await tx.wait();
  console.log("Minter role granted to Faucet successfully");

  // 4. Verify on Etherscan
  console.log("Waiting 30 seconds for block confirmations before verifying...");
  // We wait so Etherscan knows the contract exists
  await new Promise(r => setTimeout(r, 30000));

  try {
    await hre.run("verify:verify", { address: tokenAddress });
    console.log("Token verified");
  } catch (e) { console.log("Token verification failed:", e.message); }

  try {
    await hre.run("verify:verify", {
      address: faucetAddress,
      constructorArguments: [tokenAddress]
    });
    console.log("Faucet verified");
  } catch (e) { console.log("Faucet verification failed:", e.message); }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});