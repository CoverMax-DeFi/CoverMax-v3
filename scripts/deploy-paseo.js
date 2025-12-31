const hre = require("hardhat");
const fs = require("fs");

// Utility to wait between deployments
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Deploy single contract with proper gas settings
async function deployContract(name, args = []) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Deploying ${name}...`);

  const Contract = await ethers.getContractFactory(name);
  const feeData = await ethers.provider.getFeeData();

  const contract = await Contract.deploy(...args, {
    gasPrice: feeData.gasPrice,
    gasLimit: 5000000
  });

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`✅ ${name} deployed to:`, address);
  return contract;
}

async function main() {
  console.log("=".repeat(70));
  console.log("CoverMax Complete Deployment to Paseo Asset Hub");
  console.log("=".repeat(70));

  const [deployer] = await hre.ethers.getSigners();
  console.log("\nDeploying from:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "PAS");

  if (balance < ethers.parseEther("0.1")) {
    console.log("\n⚠️  WARNING: Low balance. You may need more PAS tokens for deployment.");
  }

  console.log("\n" + "=".repeat(70));
  console.log("STEP 1: Deploying Core Contracts");
  console.log("=".repeat(70));

  // Deploy mock tokens
  const mockAUSDC = await deployContract("MockAUSDC");
  await sleep(3000);

  const mockCUSDT = await deployContract("MockCUSDT");
  await sleep(3000);

  // Deploy Uniswap infrastructure
  const weth = await deployContract("WETH");
  await sleep(3000);

  const factory = await deployContract("UniswapV2Factory", [deployer.address]);
  await sleep(3000);

  const router = await deployContract("UniswapV2Router02", [
    await factory.getAddress(),
    await weth.getAddress()
  ]);
  await sleep(3000);

  // Deploy RiskVault (this also deploys SeniorToken and JuniorToken)
  const riskVault = await deployContract("RiskVault", [
    await mockAUSDC.getAddress(),
    await mockCUSDT.getAddress()
  ]);
  await sleep(3000);

  // Get risk token addresses
  const seniorTokenAddress = await riskVault.seniorToken();
  const juniorTokenAddress = await riskVault.juniorToken();

  console.log("\n✅ Risk tokens deployed:");
  console.log("  Senior Token:", seniorTokenAddress);
  console.log("  Junior Token:", juniorTokenAddress);

  console.log("\n" + "=".repeat(70));
  console.log("STEP 2: Creating Uniswap Pair for Risk Tokens");
  console.log("=".repeat(70));

  const feeData = await ethers.provider.getFeeData();
  let tx = await factory.createPair(seniorTokenAddress, juniorTokenAddress, {
    gasPrice: feeData.gasPrice,
    gasLimit: 5000000
  });
  await tx.wait();

  const pairAddress = await factory.getPair(seniorTokenAddress, juniorTokenAddress);
  console.log("✅ Pair created:", pairAddress);
  await sleep(3000);

  console.log("\n" + "=".repeat(70));
  console.log("STEP 3: Setting Up Initial Liquidity");
  console.log("=".repeat(70));

  // Mint test tokens to deployer
  const mintAmount = hre.ethers.parseEther("100000");
  console.log("\nMinting 100k test tokens to deployer...");

  tx = await mockAUSDC.mint(deployer.address, mintAmount);
  await tx.wait();
  console.log("  ✅ Minted 100k aUSDC");
  await sleep(2000);

  tx = await mockCUSDT.mint(deployer.address, mintAmount);
  await tx.wait();
  console.log("  ✅ Minted 100k cUSDT");
  await sleep(2000);

  // Deposit into RiskVault to get risk tokens
  const depositAmount = hre.ethers.parseEther("50000");
  console.log("\nDepositing 50k of each token into RiskVault...");

  tx = await mockAUSDC.approve(await riskVault.getAddress(), depositAmount);
  await tx.wait();
  await sleep(1000);

  tx = await mockCUSDT.approve(await riskVault.getAddress(), depositAmount);
  await tx.wait();
  await sleep(1000);

  tx = await riskVault.depositAsset(await mockAUSDC.getAddress(), depositAmount);
  await tx.wait();
  console.log("  ✅ Deposited 50k aUSDC");
  await sleep(2000);

  tx = await riskVault.depositAsset(await mockCUSDT.getAddress(), depositAmount);
  await tx.wait();
  console.log("  ✅ Deposited 50k cUSDT");
  await sleep(2000);

  // Check risk token balances
  const SeniorToken = await hre.ethers.getContractAt("RiskToken", seniorTokenAddress);
  const JuniorToken = await hre.ethers.getContractAt("RiskToken", juniorTokenAddress);

  const seniorBalance = await SeniorToken.balanceOf(deployer.address);
  const juniorBalance = await JuniorToken.balanceOf(deployer.address);

  console.log("\nRisk token balances:");
  console.log("  Senior:", hre.ethers.formatEther(seniorBalance));
  console.log("  Junior:", hre.ethers.formatEther(juniorBalance));

  // Add liquidity to Uniswap
  const liquidityAmount = hre.ethers.parseEther("25000");
  console.log("\nAdding 25k of each risk token to Uniswap pool...");

  tx = await SeniorToken.approve(await router.getAddress(), liquidityAmount);
  await tx.wait();
  await sleep(1000);

  tx = await JuniorToken.approve(await router.getAddress(), liquidityAmount);
  await tx.wait();
  await sleep(1000);

  const deadline = Math.floor(Date.now() / 1000) + 300;
  tx = await router.addLiquidity(
    seniorTokenAddress,
    juniorTokenAddress,
    liquidityAmount,
    liquidityAmount,
    0,
    0,
    deployer.address,
    deadline,
    {
      gasPrice: feeData.gasPrice,
      gasLimit: 5000000
    }
  );
  await tx.wait();
  console.log("  ✅ Liquidity added to pool");

  // Verify liquidity
  const Pair = await hre.ethers.getContractAt("UniswapV2Pair", pairAddress);
  const [reserve0, reserve1] = await Pair.getReserves();
  console.log("\nPool reserves:");
  console.log("  Reserve0:", hre.ethers.formatEther(reserve0));
  console.log("  Reserve1:", hre.ethers.formatEther(reserve1));

  console.log("\n" + "=".repeat(70));
  console.log("STEP 4: Saving Deployment Information");
  console.log("=".repeat(70));

  // Save deployment info
  const deployment = {
    network: "Paseo Asset Hub Testnet",
    chainId: "420420422",
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      mockAUSDC: await mockAUSDC.getAddress(),
      mockCUSDT: await mockCUSDT.getAddress(),
      weth: await weth.getAddress(),
      uniswapFactory: await factory.getAddress(),
      uniswapRouter: await router.getAddress(),
      riskVault: await riskVault.getAddress(),
      seniorToken: seniorTokenAddress,
      juniorToken: juniorTokenAddress,
      seniorJuniorPair: pairAddress
    },
    initialLiquidity: {
      senior: hre.ethers.formatEther(liquidityAmount),
      junior: hre.ethers.formatEther(liquidityAmount),
      reserve0: hre.ethers.formatEther(reserve0),
      reserve1: hre.ethers.formatEther(reserve1)
    }
  };

  fs.writeFileSync("paseo-deployment.json", JSON.stringify(deployment, null, 2));
  console.log("✅ Deployment info saved to paseo-deployment.json");

  console.log("\n" + "=".repeat(70));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(70));

  console.log("\n📋 Contract Addresses:");
  console.log("  RiskVault:", deployment.contracts.riskVault);
  console.log("  Senior Token:", deployment.contracts.seniorToken);
  console.log("  Junior Token:", deployment.contracts.juniorToken);
  console.log("  Mock aUSDC:", deployment.contracts.mockAUSDC);
  console.log("  Mock cUSDT:", deployment.contracts.mockCUSDT);
  console.log("  Uniswap Router:", deployment.contracts.uniswapRouter);
  console.log("  Uniswap Factory:", deployment.contracts.uniswapFactory);
  console.log("  Senior/Junior Pair:", deployment.contracts.seniorJuniorPair);

  console.log("\n📊 Protocol Status:");
  console.log("  ✅ All contracts deployed");
  console.log("  ✅ Uniswap pair created");
  console.log("  ✅ Initial liquidity added (25k of each risk token)");
  console.log("  ✅ Deployer has test tokens remaining");

  console.log("\n🔧 Next Steps:");
  console.log("  1. Update frontend config with these addresses (or run: npm run generate-config)");
  console.log("  2. Mint tokens to test users: npm run mint-tokens <address>");
  console.log("  3. Verify deployment: npm run verify-deployment");
  console.log("  4. Start frontend and begin testing");

  console.log("\n" + "=".repeat(70));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
