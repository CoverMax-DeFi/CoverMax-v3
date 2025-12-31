# Paseo Asset Hub Deployment Guide

This guide explains how to deploy CoverMax contracts to Paseo Asset Hub testnet (Polkadot).

## Prerequisites

1. **Paseo Test Tokens (PAS)**
   - Get PAS tokens from Polkadot faucet: https://faucet.polkadot.io/
   - Or use Paseo Asset Hub faucet: https://paritytech.github.io/polkadot-testnet-faucet/

2. **Environment Setup**
   ```bash
   # .env file
   PRIVATE_KEY=your_private_key_here
   ```

3. **Dependencies Installed**
   ```bash
   npm install
   ```

## Quick Start - Complete Deployment

Deploy everything in one command:

```bash
npm run deploy:paseo
```

This single command will:
- Deploy all 8 contracts (RiskVault, mock tokens, Uniswap infrastructure)
- Create the Senior/Junior Uniswap pair
- Add initial liquidity (25k of each risk token)
- Save deployment info to `paseo-deployment.json`

**Expected Duration**: ~3-5 minutes

## Post-Deployment Commands

### Verify Deployment

Check that all contracts are deployed and configured correctly:

```bash
npm run verify:paseo
```

This will verify:
- All contracts are deployed
- Liquidity pools have reserves
- Price queries work
- Vault balances are correct

### Mint Tokens to Users

Mint test tokens (aUSDC and cUSDT) to user wallets:

```bash
npm run mint-tokens:paseo 0xUSER_ADDRESS_HERE
```

Example:
```bash
npm run mint-tokens:paseo 0x1234567890123456789012345678901234567890
```

This mints 1,000,000 aUSDC and 1,000,000 cUSDT to the specified address.

## Deployment Artifacts

After deployment, you'll find:

### paseo-deployment.json
Contains all deployed contract addresses and deployment info:
```json
{
  "network": "Paseo Asset Hub Testnet",
  "chainId": "420420422",
  "deployer": "0x...",
  "deployedAt": "2025-12-31T...",
  "contracts": {
    "mockAUSDC": "0x...",
    "mockCUSDT": "0x...",
    "riskVault": "0x...",
    "seniorToken": "0x...",
    "juniorToken": "0x...",
    "uniswapRouter": "0x...",
    "seniorJuniorPair": "0x..."
  }
}
```

## Updating Frontend Configuration

The deployment script saves addresses to `paseo-deployment.json`. To update the frontend:

1. **Automatic** (if available):
   ```bash
   npm run update-frontend-config
   ```

2. **Manual**: Update `frontend/src/config/contracts.ts` with addresses from `paseo-deployment.json`

## Network Configuration

The Paseo network is configured in `hardhat.config.ts`:

```typescript
passetHub: {
  url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  gasPrice: 1000000000000, // 1000 gwei (required by Paseo)
  timeout: 60000,
  polkavm: true, // Required for Polkadot PolkaVM compatibility
}
```

**Important**: Paseo requires 1000 gwei gas price, much higher than typical EVM networks.

## Troubleshooting

### Transactions Getting Dropped

**Symptom**: Deployment fails with "transaction dropped" errors

**Solution**: This is handled by the deployment script, which:
- Deploys contracts sequentially (not batched)
- Adds 3-second delays between deployments
- Uses proper gas settings (1000 gwei)

### Low Balance Warning

**Symptom**: "Low balance. You may need more PAS tokens"

**Solution**: Get more PAS tokens from the faucet before deployment

### Frontend Shows Wrong Network

**Symptom**: Frontend connects to wrong network (e.g., Moonbeam)

**Solution**:
1. Clear browser cache
2. Disconnect wallet
3. Reconnect and manually select Paseo Asset Hub
4. Verify `frontend/src/config/contracts.ts` has `DEFAULT_CHAIN_ID = SupportedChainId.PASEO_TESTNET`

### Missing Liquidity Errors

**Symptom**: Swaps fail with "INSUFFICIENT_LIQUIDITY"

**Solution**: Run the deployment script again - it includes liquidity setup. Or verify deployment with:
```bash
npm run verify:paseo
```

## Technical Details

### Why Sequential Deployment?

Paseo Asset Hub uses Substrate's two-dimensional weight system (ref_time + proof_size). Batched deployments accumulate proof_size and exceed network limits. Our deployment script deploys contracts one-by-one with delays to avoid this.

### Deployment Script Structure

The `scripts/deploy-paseo.js` script performs these steps:

1. **Deploy Core Contracts** (with 3s delays):
   - MockAUSDC
   - MockCUSDT
   - WETH
   - UniswapV2Factory
   - UniswapV2Router02
   - RiskVault (deploys SeniorToken and JuniorToken internally)

2. **Create Uniswap Pair**:
   - Creates Senior/Junior token pair

3. **Setup Initial Liquidity**:
   - Mints 100k test tokens to deployer
   - Deposits 50k of each to RiskVault (gets risk tokens)
   - Adds 25k of each risk token to Uniswap pool

4. **Save Deployment Info**:
   - Writes addresses and config to `paseo-deployment.json`

### Gas Settings

All transactions use:
- Gas Price: 1000 gwei (from network via `getFeeData()`)
- Gas Limit: 5,000,000

## Complete Example Workflow

```bash
# 1. Deploy everything
npm run deploy:paseo

# 2. Verify deployment
npm run verify:paseo

# 3. Mint tokens for testing (repeat for each tester)
npm run mint-tokens:paseo 0xTester1Address
npm run mint-tokens:paseo 0xTester2Address

# 4. Update frontend (if needed)
npm run update-frontend-config

# 5. Start frontend
cd frontend
npm run dev
```

## Additional Resources

- **Troubleshooting Guide**: See `DEPLOYMENT_TROUBLESHOOTING_REPORT.md` for detailed technical analysis
- **Paseo Explorer**: https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com
- **Network Info**: https://wiki.polkadot.network/docs/build-pdk
- **Web3 Foundation Grant**: Milestone 3 deployment requirement

## Support

For issues or questions:
1. Check `DEPLOYMENT_TROUBLESHOOTING_REPORT.md` for common issues
2. Verify network configuration in `hardhat.config.ts`
3. Ensure sufficient PAS balance for deployment
4. Review deployment logs for specific errors
