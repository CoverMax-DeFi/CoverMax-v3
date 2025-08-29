import { useWeb3 } from '@/context/PrivyWeb3Context';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import { RISK_THRESHOLDS, WEI_PRECISION } from '@/constants/trading';
import { RISK_PROFILE_COLORS, RISK_PROFILE_LABELS, DEFAULT_DECIMAL_PLACES } from '@/constants/ui';

export const usePortfolioCalculations = (seniorPrice: string, juniorPrice: string) => {
  const { balances, vaultInfo } = useWeb3();

  const formatTokenAmount = (amount: bigint) => ethers.formatEther(amount);
  const formatNumber = (num: number, decimals = DEFAULT_DECIMAL_PLACES) => num.toFixed(decimals);

  // Memoized calculated values
  const { seniorBalance, juniorBalance, aUSDCBalance, cUSDTBalance, lpBalance } = useMemo(() => ({
    seniorBalance: Number(formatTokenAmount(balances.seniorTokens)),
    juniorBalance: Number(formatTokenAmount(balances.juniorTokens)),
    aUSDCBalance: Number(formatTokenAmount(balances.aUSDC)),
    cUSDTBalance: Number(formatTokenAmount(balances.cUSDT)),
    lpBalance: Number(formatTokenAmount(balances.lpTokens)),
  }), [balances.seniorTokens, balances.juniorTokens, balances.aUSDC, balances.cUSDT, balances.lpTokens]);
  
  // Calculate LP token USD value using pool reserves
  const calculateLPValueUSD = (poolReserves: { senior: string; junior: string }) => {
    if (!poolReserves.senior || !poolReserves.junior || lpBalance === 0) return 0;
    
    const seniorReserve = parseFloat(poolReserves.senior);
    const juniorReserve = parseFloat(poolReserves.junior);
    
    // Total pool value in USD
    const totalPoolValueUSD = (seniorReserve * parseFloat(seniorPrice)) + (juniorReserve * parseFloat(juniorPrice));
    
    // Assume total LP supply is approximately equal to the geometric mean of reserves for typical AMM
    // This is an approximation - ideally we'd fetch the actual totalSupply from the pair contract
    const estimatedTotalLPSupply = Math.sqrt(seniorReserve * juniorReserve);
    
    if (estimatedTotalLPSupply === 0) return 0;
    
    // User's share of pool value
    return (lpBalance / estimatedTotalLPSupply) * totalPoolValueUSD;
  };

  const { totalPortfolioValue, protocolTVL, userSharePercent } = useMemo(() => ({
    totalPortfolioValue: (seniorBalance * parseFloat(seniorPrice)) + (juniorBalance * parseFloat(juniorPrice)),
    protocolTVL: (Number(vaultInfo.aUSDCBalance) + Number(vaultInfo.cUSDTBalance)) / WEI_PRECISION,
    userSharePercent: vaultInfo.totalTokensIssued > 0n
      ? ((seniorBalance + juniorBalance) / (Number(vaultInfo.totalTokensIssued) / WEI_PRECISION) * 100)
      : 0,
  }), [seniorBalance, juniorBalance, seniorPrice, juniorPrice, vaultInfo.aUSDCBalance, vaultInfo.cUSDTBalance, vaultInfo.totalTokensIssued]);

  // Memoized Risk Assessment
  const riskProfile = useMemo(() => {
    const totalTokens = seniorBalance + juniorBalance;
    if (totalTokens === 0) return { 
      level: RISK_PROFILE_LABELS.NONE, 
      color: RISK_PROFILE_COLORS.None, 
      percentage: 0 
    };

    const seniorRatio = seniorBalance / totalTokens;
    if (seniorRatio >= RISK_THRESHOLDS.CONSERVATIVE) return { 
      level: RISK_PROFILE_LABELS.CONSERVATIVE, 
      color: RISK_PROFILE_COLORS.Conservative, 
      percentage: seniorRatio * 100 
    };
    if (seniorRatio >= RISK_THRESHOLDS.MODERATE) return { 
      level: RISK_PROFILE_LABELS.MODERATE, 
      color: RISK_PROFILE_COLORS.Moderate, 
      percentage: seniorRatio * 100 
    };
    if (seniorRatio >= RISK_THRESHOLDS.BALANCED) return { 
      level: RISK_PROFILE_LABELS.BALANCED, 
      color: RISK_PROFILE_COLORS.Balanced, 
      percentage: seniorRatio * 100 
    };
    if (seniorRatio >= RISK_THRESHOLDS.GROWTH) return { 
      level: RISK_PROFILE_LABELS.GROWTH, 
      color: RISK_PROFILE_COLORS.Growth, 
      percentage: seniorRatio * 100 
    };
    return { 
      level: RISK_PROFILE_LABELS.AGGRESSIVE, 
      color: RISK_PROFILE_COLORS.Aggressive, 
      percentage: seniorRatio * 100 
    };
  }, [seniorBalance, juniorBalance]);

  return {
    formatTokenAmount,
    formatNumber,
    seniorBalance,
    juniorBalance,
    aUSDCBalance,
    cUSDTBalance,
    lpBalance,
    calculateLPValueUSD,
    totalPortfolioValue,
    protocolTVL,
    userSharePercent,
    riskProfile,
  };
};