const fs = require('fs');
const path = require('path');

console.log("=".repeat(70));
console.log("Updating Frontend Config with Paseo Deployment");
console.log("=".repeat(70));

// Read the deployment file
const deploymentPath = path.join(__dirname, '..', 'paseo-deployment.json');
if (!fs.existsSync(deploymentPath)) {
  console.error("\n❌ Error: paseo-deployment.json not found!");
  console.error("   Please run 'npm run deploy:paseo' first.");
  process.exit(1);
}

const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
console.log("\n✅ Read deployment file:");
console.log("   Network:", deployment.network);
console.log("   Chain ID:", deployment.chainId);
console.log("   Deployed at:", deployment.deployedAt);

// Read the frontend config file
const configPath = path.join(__dirname, '..', 'frontend', 'src', 'config', 'contracts.ts');
if (!fs.existsSync(configPath)) {
  console.error("\n❌ Error: frontend/src/config/contracts.ts not found!");
  process.exit(1);
}

let configContent = fs.readFileSync(configPath, 'utf8');

// Map deployment.json keys to ContractName enum values
const contractMapping = {
  'mockAUSDC': 'MOCK_AUSDC',
  'mockCUSDT': 'MOCK_CUSDT',
  'weth': 'WETH',
  'uniswapFactory': 'UNISWAP_V2_FACTORY',
  'uniswapRouter': 'UNISWAP_V2_ROUTER',
  'riskVault': 'RISK_VAULT',
  'juniorToken': 'JUNIOR_TOKEN',
  'seniorToken': 'SENIOR_TOKEN',
  'seniorJuniorPair': 'SENIOR_JUNIOR_PAIR'
};

// Build the new Paseo config block
const paseoConfig = [];
for (const [deployKey, contractName] of Object.entries(contractMapping)) {
  if (deployment.contracts[deployKey]) {
    paseoConfig.push(`    [ContractName.${contractName}]: "${deployment.contracts[deployKey]}",`);
  }
}

const newPaseoBlock = `  [SupportedChainId.PASEO_TESTNET]: {
${paseoConfig.join('\n')}
  },`;

// Find and replace the PASEO_TESTNET block
const paseoBlockRegex = /\[SupportedChainId\.PASEO_TESTNET\]:\s*\{[^}]*\},/s;

if (paseoBlockRegex.test(configContent)) {
  configContent = configContent.replace(paseoBlockRegex, newPaseoBlock);
  console.log("\n✅ Updated existing PASEO_TESTNET configuration");
} else {
  console.error("\n❌ Error: Could not find PASEO_TESTNET block in config file!");
  console.error("   Please check frontend/src/config/contracts.ts");
  process.exit(1);
}

// Write the updated config
fs.writeFileSync(configPath, configContent, 'utf8');

console.log("\n✅ Frontend config updated successfully!");
console.log("\n📋 Updated Addresses:");
for (const [deployKey, contractName] of Object.entries(contractMapping)) {
  if (deployment.contracts[deployKey]) {
    console.log(`   ${contractName}: ${deployment.contracts[deployKey]}`);
  }
}

console.log("\n🔧 Next Steps:");
console.log("   1. Restart your frontend dev server if it's running");
console.log("   2. Clear browser cache and reconnect wallet");
console.log("   3. Verify contracts load correctly in the UI");

console.log("\n" + "=".repeat(70));
