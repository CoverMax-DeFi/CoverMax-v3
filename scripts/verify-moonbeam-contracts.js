const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read deployed addresses
const deployedAddressesPath = path.join(__dirname, '../ignition/deployments/chain-1287/deployed_addresses.json');
const deployedAddresses = JSON.parse(fs.readFileSync(deployedAddressesPath, 'utf8'));

// Contract verification configurations
const verificationConfigs = [
  {
    name: 'MockAUSDC',
    address: deployedAddresses['RiskTokenSequentialModule#MockAUSDC'],
    constructorArgs: [],
    contract: 'contracts/mocks/MockAUSDC.sol:MockAUSDC'
  },
  {
    name: 'MockCUSDT', 
    address: deployedAddresses['RiskTokenSequentialModule#MockCUSDT'],
    constructorArgs: [],
    contract: 'contracts/mocks/MockCUSDT.sol:MockCUSDT'
  },
  {
    name: 'WETH',
    address: deployedAddresses['RiskTokenSequentialModule#WETH'],
    constructorArgs: []
  },
  {
    name: 'UniswapV2Factory',
    address: deployedAddresses['RiskTokenSequentialModule#UniswapV2Factory'],
    constructorArgs: ['0x4F2cD1d7Ec17639e48a9BcD19fcEF65BA8D93C42'] // Deployer address from deployment
  },
  {
    name: 'RiskVault',
    address: deployedAddresses['RiskTokenSequentialModule#RiskVault'],
    constructorArgs: [
      deployedAddresses['RiskTokenSequentialModule#MockAUSDC'],
      deployedAddresses['RiskTokenSequentialModule#MockCUSDT']
    ]
  },
  {
    name: 'UniswapV2Router02',
    address: deployedAddresses['RiskTokenSequentialModule#UniswapV2Router02'],
    constructorArgs: [
      deployedAddresses['RiskTokenSequentialModule#UniswapV2Factory'],
      deployedAddresses['RiskTokenSequentialModule#WETH']
    ]
  },
  {
    name: 'RiskToken (Senior)',
    address: deployedAddresses['RiskTokenSequentialModule#seniorTokenContract'],
    constructorArgs: ['CoverMax Senior Token', 'CM-SENIOR'],
    contract: 'contracts/RiskToken.sol:RiskToken'
  },
  {
    name: 'RiskToken (Junior)',
    address: deployedAddresses['RiskTokenSequentialModule#juniorTokenContract'], 
    constructorArgs: ['CoverMax Junior Token', 'CM-JUNIOR'],
    contract: 'contracts/RiskToken.sol:RiskToken'
  }
];

async function verifyContract(config, retries = 3) {
  return new Promise((resolve, reject) => {
    const argsString = config.constructorArgs.length > 0 
      ? ' ' + config.constructorArgs.map(arg => `"${arg}"`).join(' ')
      : '';
    
    const contractFlag = config.contract ? ` --contract ${config.contract}` : '';
    const command = `npx hardhat verify --network moonbeamTestnet${contractFlag} ${config.address}${argsString}`;
    
    console.log(`\n🔍 Verifying ${config.name}...`);
    console.log(`Address: ${config.address}`);
    console.log(`Command: ${command}`);
    
    exec(command, { timeout: 60000 }, async (error, stdout, stderr) => {
      if (error) {
        if (stderr.includes('Already Verified') || stdout.includes('Already Verified') || 
            stdout.includes('already been verified') || stderr.includes('already been verified')) {
          console.log(`✅ ${config.name} is already verified`);
          resolve();
        } else if ((stderr.includes('ECONNRESET') || stderr.includes('network request failed')) && retries > 0) {
          console.log(`⚠️  Network error for ${config.name}, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          try {
            await verifyContract(config, retries - 1);
            resolve();
          } catch (e) {
            reject(e);
          }
        } else {
          console.error(`❌ Failed to verify ${config.name}:`, error.message);
          reject(error);
        }
      } else {
        console.log(`✅ Successfully verified ${config.name}`);
        if (stdout.includes('Successfully verified')) {
          console.log('✨ New verification completed!');
        }
        resolve();
      }
    });
  });
}

async function verifyAllContracts() {
  console.log('🚀 Starting Moonbeam contract verification...\n');
  
  for (const config of verificationConfigs) {
    try {
      await verifyContract(config);
      // Add delay between verifications to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to verify ${config.name}, continuing with next contract...`);
    }
  }
  
  console.log('\n🎉 Contract verification process completed!');
  console.log('\n📋 Summary:');
  console.log('Check https://moonbase.moonscan.io/ to view your verified contracts');
}

// Run the verification
verifyAllContracts().catch(console.error);