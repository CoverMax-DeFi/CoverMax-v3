// Auto-generated from Ignition deployment artifacts
// DO NOT EDIT MANUALLY - Run 'npm run generate-config' to regenerate

// Supported chain IDs
export enum SupportedChainId {
  MOONBEAM_TESTNET = 1287,
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
  [SupportedChainId.HEDERA_TESTNET]: {
    [ContractName.MOCK_AUSDC]: "0xc6461cf8E77b40293d90c9670FcC2Da04346Df1A",
    [ContractName.MOCK_CUSDT]: "0xe786547f22F29E477B51135b24A39E937d291d17",
    [ContractName.UNISWAP_V2_FACTORY]: "0x3e83552ED9bF1418Bf50fbc7071C87361Ce156b5",
    [ContractName.WETH]: "0xED6eF615b61D37a5E1cce5D5Aaddc1064Fb9fA07",
    [ContractName.RISK_VAULT]: "0x86840DBAE8aF63780ffFB2990aADDF5C78aeb184",
    [ContractName.UNISWAP_V2_ROUTER]: "0xBA659094Ffd44F3CCcFffd7c172cB42f0aD362b0",
    [ContractName.JUNIOR_TOKEN]: "0x2DDd2DD26A3d90d4a67F02A69728B386B1461710",
    [ContractName.SENIOR_TOKEN]: "0xC5F805bBD905803e5Ec1280827068B9889978cF3",
    [ContractName.SENIOR_JUNIOR_PAIR]: "0x40C4F4B6fB472bFE986134A2A99C691E4323b09E",
  },
  [SupportedChainId.FLOW_TESTNET]: {
    [ContractName.MOCK_AUSDC]: "0x27448B112B42c930915bF3953A691c80BdcE7208",
    [ContractName.MOCK_CUSDT]: "0x39b0982322FfbFd17Bc705ef6E55dc92581337Ef",
    [ContractName.UNISWAP_V2_FACTORY]: "0x59Bb52f2F93eA480df5d4549C12F5062Adccd087",
    [ContractName.WETH]: "0xFb01cCbf406E820163911D0A37d89Bab72A85399",
    [ContractName.RISK_VAULT]: "0x0b6371795b2Ef3149dbd3803eeaf8576282C127A",
    [ContractName.UNISWAP_V2_ROUTER]: "0x0357D34e591C25b78565611C9d3401553Fff9737",
    [ContractName.JUNIOR_TOKEN]: "0xA050373612033aA1440a549496400cA48a84Cbdd",
    [ContractName.SENIOR_TOKEN]: "0xd3ef53FC2874522Aee118640f6e4B632573Ea474",
    [ContractName.SENIOR_JUNIOR_PAIR]: "0x8609546aE826d023c804a48218FD5EC3037e2059",
  },
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
};

// Default chain configuration (Moonbeam Testnet)
export const DEFAULT_CHAIN_ID = SupportedChainId.MOONBEAM_TESTNET;
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
  network: "Moonbase Alpha",
  chainId: 1287,
  deployedAt: 1751731602070,
  deploymentBlock: "Latest", // Could be extracted from deployment artifacts
} as const;
