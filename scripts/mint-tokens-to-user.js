const hre = require("hardhat");
const deployment = require("../paseo-deployment.json");

async function main() {
  // Get the user's wallet address from command line or use the test wallet
  const userAddress = process.argv[2] || "0xF7796E6bF14BB2716f47c5D0C889A51a9052CCc3";

  console.log("=".repeat(60));
  console.log("Minting Test Tokens to User Wallet");
  console.log("=".repeat(60));
  console.log("\nTarget wallet:", userAddress);
  console.log("Network: Paseo Asset Hub\n");

  const MockAUSDC = await hre.ethers.getContractAt("MockAUSDC", deployment.contracts.mockAUSDC);
  const MockCUSDT = await hre.ethers.getContractAt("MockCUSDT", deployment.contracts.mockCUSDT);

  // Mint 1 million of each token
  const mintAmount = hre.ethers.parseEther("1000000");

  console.log("Minting tokens...");

  let tx = await MockAUSDC.mint(userAddress, mintAmount);
  await tx.wait();
  console.log("✅ Minted 1,000,000 aUSDC");

  tx = await MockCUSDT.mint(userAddress, mintAmount);
  await tx.wait();
  console.log("✅ Minted 1,000,000 cUSDT");

  // Check balances
  const aUSDCBalance = await MockAUSDC.balanceOf(userAddress);
  const cUSDTBalance = await MockCUSDT.balanceOf(userAddress);

  console.log("\n" + "=".repeat(60));
  console.log("✅ Minting Complete!");
  console.log("=".repeat(60));
  console.log("\nYour new balances:");
  console.log("  aUSDC:", hre.ethers.formatEther(aUSDCBalance).replace(/\.0+$/, ""));
  console.log("  cUSDT:", hre.ethers.formatEther(cUSDTBalance).replace(/\.0+$/, ""));

  console.log("\n📋 Next Steps:");
  console.log("  1. Refresh your frontend (Ctrl+R or Cmd+R)");
  console.log("  2. Connect your wallet");
  console.log("  3. You should now see your token balances!");
  console.log("  4. Deposit some tokens to get Senior/Junior risk tokens");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
