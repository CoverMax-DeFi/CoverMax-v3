// Auto-generated from Ignition deployment artifacts
// DO NOT EDIT MANUALLY - Run 'npm run generate-config' to regenerate

// Supported chain IDs
export enum SupportedChainId {
  MOONBEAM_TESTNET = 1287,
  PASEO_TESTNET = 420420422,
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
  [SupportedChainId.MOONBEAM_TESTNET]: {
    [ContractName.MOCK_AUSDC]: "0xF40680bD83e166884423861e8EbdEDF8c9A4fc38",
    [ContractName.MOCK_CUSDT]: "0xff26Ac53F24C283fD70809aA535fFf23B0948AD2",
    [ContractName.WETH]: "0x1dE6780F59a8c2d16dF76Ba8D2345a35307AD9db",
    [ContractName.UNISWAP_V2_FACTORY]: "0x3b354F688A86601DD153fB8D6bAC50FdA6B6A5c1",
    [ContractName.UNISWAP_V2_ROUTER]: "0x323c4DE3B7267fe9A4bEE9C9379d2099170f57cd",
    [ContractName.RISK_VAULT]: "0x9Db400b48946a4EA1f9FD32515C0dd8F1C08Fc6f",
    [ContractName.JUNIOR_TOKEN]: "0x428725D392338Db6b0D0bB7A511D42F17111893D",
    [ContractName.SENIOR_TOKEN]: "0xc015FF3A6EAF86050E7B3693cE1337e99e88D123",
    [ContractName.SENIOR_JUNIOR_PAIR]: "0x0B56dd7f83157e88F39690316b65c37F60FCdDB7",
  },
    [SupportedChainId.PASEO_TESTNET]: {
    [ContractName.MOCK_AUSDC]: "0xbc20b977781705589EC578aC7d5680Af821D4c1c",
    [ContractName.MOCK_CUSDT]: "0x0310c9Cf82c2b0a426F2a5e09d1d670B31442a63",
    [ContractName.WETH]: "0x86840528937f5f1578601d3d31Bc7cFF6A540009",
    [ContractName.UNISWAP_V2_FACTORY]: "0x64eB9f6817f43F4a666Ba9981Dce159bf3Fc93cC",
    [ContractName.UNISWAP_V2_ROUTER]: "0xd609C157ee45220E929586d8D2bAf27A59D92cB3",
    [ContractName.RISK_VAULT]: "0x78a9bCbA870A367559258AAAC5b7e533cF9C0EB7",
    [ContractName.JUNIOR_TOKEN]: "0xc3e818236440461916BF75C91bd28Bb27bEa746e",
    [ContractName.SENIOR_TOKEN]: "0x9c6A5C213F5CB326186E876C3e37ec8F73768b2B",
    [ContractName.SENIOR_JUNIOR_PAIR]: "0xC703aa238dFCFA7f7076a4033a1046614219B5c2",
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
export const CONTRACT_ADDRESSES = MULTI_CHAIN_ADDRESSES[SupportedChainId.MOONBEAM_TESTNET] as Record<string, string>;

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
  [SupportedChainId.MOONBEAM_TESTNET]: {
    chainId: 1287,
    chainName: "Moonbase Alpha",
    networkName: "moonbeam-testnet",
    nativeCurrency: {
      name: "DEV",
      symbol: "DEV",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
    blockExplorerUrls: ["https://moonbase.moonscan.io"],
    icon: "🌙",
    isTestnet: true,
  },
  [SupportedChainId.PASEO_TESTNET]: {
    chainId: 420420422,
    chainName: "Paseo Asset Hub",
    networkName: "paseo-testnet",
    nativeCurrency: {
      name: "PAS",
      symbol: "PAS",
      decimals: 18,
    },
    rpcUrls: ["https://testnet-passet-hub-eth-rpc.polkadot.io"],
    blockExplorerUrls: ["https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com"],
    icon: "🔵",
    isTestnet: true,
  },
};

// Default chain configuration (Paseo Testnet for Milestone 3)
export const DEFAULT_CHAIN_ID = SupportedChainId.PASEO_TESTNET;
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
  network: "Paseo Asset Hub",
  chainId: 420420422,
  deployedAt: 1735624764560, // December 31, 2025
  deploymentBlock: "Latest", // Could be extracted from deployment artifacts
} as const;
