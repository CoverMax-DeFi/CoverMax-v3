import { useWeb3 } from '@/context/PrivyWeb3Context';
import { ethers } from 'ethers';

export const usePortfolioCalculations = (seniorPrice: string, juniorPrice: string) => {
  const { balances, vaultInfo } = useWeb3();

  const formatTokenAmount = (amount: bigint) => ethers.formatEther(amount);
  const formatNumber = (num: number, decimals = 2) => num.toFixed(decimals);

  // Calculated values
  const seniorBalance = Number(formatTokenAmount(balances.seniorTokens));
  const juniorBalance = Number(formatTokenAmount(balances.juniorTokens));
  const aUSDCBalance = Number(formatTokenAmount(balances.aUSDC));
  const cUSDTBalance = Number(formatTokenAmount(balances.cUSDT));
  const lpBalance = Number(formatTokenAmount(balances.lpTokens));
  
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

  const totalPortfolioValue =
    (seniorBalance * parseFloat(seniorPrice)) +
    (juniorBalance * parseFloat(juniorPrice));

  const protocolTVL = (Number(vaultInfo.aUSDCBalance) + Number(vaultInfo.cUSDTBalance)) / 1e18;
  const userSharePercent = vaultInfo.totalTokensIssued > 0n
    ? ((seniorBalance + juniorBalance) / (Number(vaultInfo.totalTokensIssued) / 1e18) * 100)
    : 0;

  // Risk Assessment
  const getRiskProfile = () => {
    const totalTokens = seniorBalance + juniorBalance;
    if (totalTokens === 0) return { level: 'None', color: 'slate', percentage: 0 };

    const seniorRatio = seniorBalance / totalTokens;
    if (seniorRatio >= 0.8) return { level: 'Conservative', color: 'blue', percentage: seniorRatio * 100 };
    if (seniorRatio >= 0.6) return { level: 'Moderate', color: 'purple', percentage: seniorRatio * 100 };
    if (seniorRatio >= 0.4) return { level: 'Balanced', color: 'green', percentage: seniorRatio * 100 };
    if (seniorRatio >= 0.2) return { level: 'Growth', color: 'yellow', percentage: seniorRatio * 100 };
    return { level: 'Aggressive', color: 'red', percentage: seniorRatio * 100 };
  };

  const riskProfile = getRiskProfile();

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