const hre = require("hardhat");
const deployment = require("../paseo-deployment.json");

async function main() {
  console.log("=".repeat(70));
  console.log("Complete Paseo Deployment Verification");
  console.log("=".repeat(70));

  const [signer] = await hre.ethers.getSigners();
  console.log("\nYour address:", signer.address);

  // All contract addresses
  const addresses = deployment.contracts;

  console.log("\n" + "=".repeat(70));
  console.log("1. Verifying Core Contracts");
  console.log("=".repeat(70));

  const RiskVault = await hre.ethers.getContractAt("RiskVault", addresses.riskVault);
  const seniorAddr = await RiskVault.seniorToken();
  const juniorAddr = await RiskVault.juniorToken();
  console.log("✅ RiskVault operational");
  console.log("  Senior Token:", seniorAddr);
  console.log("  Junior Token:", juniorAddr);

  console.log("\n" + "=".repeat(70));
  console.log("2. Checking Your Token Balances");
  console.log("=".repeat(70));

  const MockAUSDC = await hre.ethers.getContractAt("MockAUSDC", addresses.mockAUSDC);
  const MockCUSDT = await hre.ethers.getContractAt("MockCUSDT", addresses.mockCUSDT);
  const SeniorToken = await hre.ethers.getContractAt("RiskToken", seniorAddr);
  const JuniorToken = await hre.ethers.getContractAt("RiskToken", juniorAddr);

  const aUSDCBal = await MockAUSDC.balanceOf(signer.address);
  const cUSDTBal = await MockCUSDT.balanceOf(signer.address);
  const seniorBal = await SeniorToken.balanceOf(signer.address);
  const juniorBal = await JuniorToken.balanceOf(signer.address);

  console.log("aUSDC Balance:", hre.ethers.formatEther(aUSDCBal));
  console.log("cUSDT Balance:", hre.ethers.formatEther(cUSDTBal));
  console.log("Senior Token Balance:", hre.ethers.formatEther(seniorBal));
  console.log("Junior Token Balance:", hre.ethers.formatEther(juniorBal));

  console.log("\n" + "=".repeat(70));
  console.log("3. Checking Uniswap Pair & Liquidity");
  console.log("=".repeat(70));

  const Pair = await hre.ethers.getContractAt("UniswapV2Pair", addresses.seniorJuniorPair);

  try {
    const [reserve0, reserve1] = await Pair.getReserves();
    const token0 = await Pair.token0();
    const token1 = await Pair.token1();
    const totalSupply = await Pair.totalSupply();

    console.log("✅ Pair exists:", addresses.seniorJuniorPair);
    console.log("  Token0:", token0);
    console.log("  Token1:", token1);
    console.log("  Reserve0:", hre.ethers.formatEther(reserve0));
    console.log("  Reserve1:", hre.ethers.formatEther(reserve1));
    console.log("  LP Total Supply:", hre.ethers.formatEther(totalSupply));

    if (reserve0 === 0n && reserve1 === 0n) {
      console.log("\n❌ WARNING: Pair has ZERO liquidity!");
      console.log("   This is why you're seeing 'INSUFFICIENT_LIQUIDITY' errors");
    } else {
      console.log("\n✅ Pair has liquidity!");
    }

    // Check LP token balance
    const lpBalance = await Pair.balanceOf(signer.address);
    console.log("  Your LP tokens:", hre.ethers.formatEther(lpBalance));

  } catch (error) {
    console.log("❌ Error reading pair:", error.message);
  }

  console.log("\n" + "=".repeat(70));
  console.log("4. Testing Price Query");
  console.log("=".repeat(70));

  const Router = await hre.ethers.getContractAt("UniswapV2Router02", addresses.uniswapRouter);

  try {
    const amountIn = hre.ethers.parseEther("1");
    const path = [seniorAddr, juniorAddr];
    const amounts = await Router.getAmountsOut(amountIn, path);

    console.log("✅ Price query successful!");
    console.log("  1 Senior Token =", hre.ethers.formatEther(amounts[1]), "Junior Tokens");
  } catch (error) {
    console.log("❌ Price query failed:", error.reason || error.message);
    console.log("   This confirms: NO LIQUIDITY in the pair");
  }

  console.log("\n" + "=".repeat(70));
  console.log("5. Vault Status");
  console.log("=".repeat(70));

  const protocolStatus = await RiskVault.getProtocolStatus();
  const vaultBalances = await RiskVault.getVaultBalances();

  console.log("Total Tokens Issued:", hre.ethers.formatEther(protocolStatus.totalTokens));
  console.log("Emergency Mode:", protocolStatus.emergency);
  console.log("Current Phase:", ["ACTIVE", "CLAIMS", "FINAL_CLAIMS"][Number(protocolStatus.phase)]);
  console.log("Vault aUSDC:", hre.ethers.formatEther(vaultBalances.aUSDCVaultBalance));
  console.log("Vault cUSDT:", hre.ethers.formatEther(vaultBalances.cUSDTVaultBalance));

  console.log("\n" + "=".repeat(70));
  console.log("SUMMARY");
  console.log("=".repeat(70));

  const issues = [];

  if (aUSDCBal === 0n && cUSDTBal === 0n) {
    issues.push("❌ You have no test tokens - need to mint some");
  }

  if (seniorBal === 0n && juniorBal === 0n) {
    issues.push("❌ You have no risk tokens - need to deposit");
  }

  try {
    const [r0, r1] = await Pair.getReserves();
    if (r0 === 0n && r1 === 0n) {
      issues.push("❌ Pair has NO liquidity - need to add liquidity");
    }
  } catch (e) {
    issues.push("❌ Can't read pair reserves");
  }

  if (issues.length > 0) {
    console.log("\n⚠️  Issues Found:");
    issues.forEach(issue => console.log(issue));
  } else {
    console.log("\n✅ Everything looks good!");
  }

  console.log("\n" + "=".repeat(70));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
