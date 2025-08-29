export interface VaultInfo {
  aUSDCBalance: bigint;
  cUSDTBalance: bigint;
  totalTokensIssued: bigint;
  emergencyMode: boolean;
  currentPhase: bigint;
  phaseStartTime: bigint;
  cycleStartTime: bigint;
  timeRemaining: bigint;
}

export interface TokenBalances {
  seniorTokens: bigint;
  juniorTokens: bigint;
  aUSDC: bigint;
  cUSDT: bigint;
  lpTokens: bigint;
}

export interface RiskProfile {
  level: string;
  color: string;
  percentage: number;
}