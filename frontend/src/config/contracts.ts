// Auto-generated from Ignition deployment artifacts
// DO NOT EDIT MANUALLY - Run 'npm run generate-config' to regenerate

// Supported chain IDs
export enum SupportedChainId {
  XRPL_EVM_TESTNET = 1449000,
}

// Contract names enum for type safety
export enum ContractName {
  RISK_VAULT = 'RiskVault',
  SENIOR_TOKEN = 'SeniorToken',
  JUNIOR_TOKEN = 'JuniorToken',
  MOCK_AUSDC = 'MockAUSDC',
  MOCK_CUSDT = 'MockCUSDT',
  UNISWAP_V2_FACTORY = 'UniswapV2Factory',
  UNISWAP_V2_ROUTER = 'UniswapV2Router02',
  WETH = 'WETH',
  SENIOR_JUNIOR_PAIR = 'SeniorJuniorPair',
}

// Multi-chain contract addresses
export const MULTI_CHAIN_ADDRESSES: Record<SupportedChainId, Partial<Record<ContractName, string>>> = {
  [SupportedChainId.XRPL_EVM_TESTNET]: {
    [ContractName.MOCK_AUSDC]: "0x88b33Eb7E03Ce244616BbFa31288dDB879E6fb19",
    [ContractName.MOCK_CUSDT]: "0xFa1642Fa8b97aa5dAE03ec1BF618BdF4Be8904EC",
    [ContractName.UNISWAP_V2_FACTORY]: "0xC1C6B80ca7bB2D190cA66189eAB5D91aDe907f6A",
    [ContractName.WETH]: "0x0AEf62AA753C4a989702Dd4c59e5d3D0d100629e",
    [ContractName.RISK_VAULT]: "0x2a67De142a342162Ae6F5C0FFC5a74a58CF90C72",
    [ContractName.UNISWAP_V2_ROUTER]: "0x84Cb1F42C6651f9493a8E76348D2049238870596",
    [ContractName.JUNIOR_TOKEN]: "0x15ADcB8b35e7faAa7cE734a8B8cd4668AAb1f292",
    [ContractName.SENIOR_TOKEN]: "0x0788e4fC67A089ce8c753f4Cf593905063bA744C",
    [ContractName.SENIOR_JUNIOR_PAIR]: "0x0f3f929C7260bfC360B251359Bb2BD64987419F7",
  },
};

// Helper function to get contract address for specific chain
export function getContractAddress(chainId: SupportedChainId, contractName: ContractName): string {
  const address = MULTI_CHAIN_ADDRESSES[chainId]?.[contractName];
  if (!address) {
    throw new Error(`Contract ${contractName} not deployed on chain ${chainId}`);
  }
  return address;
}

// Helper function to get all contract addresses for a specific chain
export function getChainContracts(chainId: SupportedChainId): Record<string, string> {
  const contracts = MULTI_CHAIN_ADDRESSES[chainId];
  if (!contracts || Object.keys(contracts).length === 0) {
    throw new Error(`No contracts deployed on chain ${chainId}`);
  }
  return contracts as Record<string, string>;
}

// Legacy export for backward compatibility (deprecated - use getContractAddress instead)
// @deprecated Use getContractAddress(chainId, contractName) instead
export const CONTRACT_ADDRESSES = MULTI_CHAIN_ADDRESSES[SupportedChainId.XRPL_EVM_TESTNET] as Record<string, string>;

// Chain configurations
export const CHAIN_CONFIGS: Record<SupportedChainId, {
  chainId: number;
  chainName: string;
  networkName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  icon: string;
  isTestnet: boolean;
}> = {
  [SupportedChainId.XRPL_EVM_TESTNET]: {
    chainId: 1449000,
    chainName: "XRPL EVM",
    networkName: "xrpl-evm-testnet",
    nativeCurrency: {
      name: "XRP",
      symbol: "XRP",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.testnet.xrplevm.org"],
    blockExplorerUrls: ["https://explorer.testnet.xrplevm.org"],
    icon: "🔗",
    isTestnet: true,
  },
};

// Default chain configuration (XRPL EVM Testnet)
export const DEFAULT_CHAIN_ID = SupportedChainId.XRPL_EVM_TESTNET;
export const CHAIN_CONFIG = CHAIN_CONFIGS[DEFAULT_CHAIN_ID];

// Helper function to get chain config by ID
export function getChainConfig(chainId: number): typeof CHAIN_CONFIGS[SupportedChainId] | null {
  return CHAIN_CONFIGS[chainId as SupportedChainId] || null;
}

// Helper function to check if chain is supported
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return Object.values(SupportedChainId).includes(chainId as SupportedChainId);
}

// Helper function to get contract address safely without throwing
export function getContractAddressSafe(
  chainId: SupportedChainId, 
  contractName: ContractName
): string | null {
  try {
    return getContractAddress(chainId, contractName);
  } catch {
    return null;
  }
}

// Helper function to check if a contract is deployed on a chain
export function isContractDeployed(
  chainId: SupportedChainId, 
  contractName: ContractName
): boolean {
  return getContractAddressSafe(chainId, contractName) !== null;
}

// Helper function to get deployment status for all contracts on a chain
export function getChainDeploymentStatus(chainId: SupportedChainId): Record<ContractName, boolean> {
  const status = {} as Record<ContractName, boolean>;
  
  Object.values(ContractName).forEach(contractName => {
    status[contractName] = isContractDeployed(chainId, contractName);
  });
  
  return status;
}

// Phase enum matching the smart contract
export enum Phase {
  ACTIVE = 0,
  CLAIMS = 1,
  FINAL_CLAIMS = 2,
}

export const PHASE_NAMES = {
  [Phase.ACTIVE]: "Active Period",
  [Phase.CLAIMS]: "Claims Period", 
  [Phase.FINAL_CLAIMS]: "Final Claims Period",
} as const;

// Utility function to get phase name from BigInt
export function getPhaseNameFromBigInt(phase: bigint | undefined): string {
  if (phase === undefined) return 'Loading...';
  return PHASE_NAMES[Number(phase) as Phase] || `Unknown Phase (${phase.toString()})`;
}

// Phase durations in seconds (matching smart contract)
export const PHASE_DURATIONS = {
  [Phase.ACTIVE]: 5 * 24 * 60 * 60, // 5 days
  [Phase.CLAIMS]: 1 * 24 * 60 * 60, // 1 day
  [Phase.FINAL_CLAIMS]: 1 * 24 * 60 * 60, // 1 day
} as const;

// Deployment info
export const DEPLOYMENT_INFO = {
  network: "XRPL EVM",
  chainId: 1449000,
  deployedAt: Date.now(),
  deploymentBlock: "Latest", // Could be extracted from deployment artifacts
} as const;
