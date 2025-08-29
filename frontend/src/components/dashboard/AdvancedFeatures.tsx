import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Minus,
  RefreshCw,
  Info,
  Plus,
} from 'lucide-react';

interface AdvancedFeaturesProps {
  seniorBalance: number;
  juniorBalance: number;
  lpBalance: number;
  calculateLPValueUSD: (poolReserves: { senior: string; junior: string }) => number;
  seniorPrice: string;
  juniorPrice: string;
  poolReserves: { senior: string; junior: string };
  formatNumber: (num: number, decimals?: number) => string;
  isExecuting: boolean;
  vaultInfo: { emergencyMode: boolean };
  onStakeRiskTokens: (seniorAmount: string, juniorAmount: string) => void;
  onUnstakeRiskTokens: (amount: string) => void;
  onEmergencyWithdraw: (amount: string, asset: 'aUSDC' | 'cUSDT') => void;
}

const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({
  seniorBalance,
  juniorBalance,
  lpBalance,
  calculateLPValueUSD,
  seniorPrice,
  juniorPrice,
  poolReserves,
  formatNumber,
  isExecuting,
  vaultInfo,
  onStakeRiskTokens,
  onUnstakeRiskTokens,
  onEmergencyWithdraw,
}) => {
  const [stakingSeniorAmount, setStakingSeniorAmount] = useState('');
  const [stakingJuniorAmount, setStakingJuniorAmount] = useState('');
  const [isAutoBalancing, setIsAutoBalancing] = useState(true);
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [emergencyAmount, setEmergencyAmount] = useState('');
  const [preferredAsset, setPreferredAsset] = useState<'aUSDC' | 'cUSDT'>('aUSDC');

  // Calculate the USD value of LP tokens
  const lpValueUSD = calculateLPValueUSD(poolReserves);

  const handleStakeRiskTokens = () => {
    if (!stakingSeniorAmount || !stakingJuniorAmount) return;
    onStakeRiskTokens(stakingSeniorAmount, stakingJuniorAmount);
    setStakingSeniorAmount('');
    setStakingJuniorAmount('');
  };

  const handleUnstakeRiskTokens = () => {
    if (!unstakeAmount) return;
    onUnstakeRiskTokens(unstakeAmount);
    setUnstakeAmount('');
  };

  const handleEmergencyWithdraw = () => {
    if (!emergencyAmount) return;
    onEmergencyWithdraw(emergencyAmount, preferredAsset);
    setEmergencyAmount('');
  };

  // Helper function to calculate pool ratio
  const getPoolRatio = () => {
    const seniorReserves = parseFloat(poolReserves.senior);
    const juniorReserves = parseFloat(poolReserves.junior);

    if (seniorReserves <= 0 || juniorReserves <= 0) {
      return null; // No valid ratio available
    }

    return juniorReserves / seniorReserves; // junior per senior token
  };

  // Auto-balance senior amount based on junior input
  const handleSeniorAmountChange = (value: string) => {
    setStakingSeniorAmount(value);

    if (isAutoBalancing && value && !isNaN(parseFloat(value))) {
      const poolRatio = getPoolRatio();
      if (poolRatio) {
        const seniorAmount = parseFloat(value);
        const calculatedJuniorAmount = seniorAmount * poolRatio;

        // Ensure we don't exceed balance limits
        const maxJuniorAmount = Math.min(calculatedJuniorAmount, juniorBalance);
        setStakingJuniorAmount(maxJuniorAmount.toFixed(6));

        // If junior amount was capped, adjust senior amount accordingly
        if (calculatedJuniorAmount > juniorBalance) {
          const adjustedSeniorAmount = juniorBalance / poolRatio;
          setStakingSeniorAmount(Math.min(adjustedSeniorAmount, seniorBalance).toFixed(6));
        }
      }
    } else if (!value) {
      setStakingJuniorAmount('');
    }
  };

  // Auto-balance junior amount based on senior input
  const handleJuniorAmountChange = (value: string) => {
    setStakingJuniorAmount(value);

    if (isAutoBalancing && value && !isNaN(parseFloat(value))) {
      const poolRatio = getPoolRatio();
      if (poolRatio) {
        const juniorAmount = parseFloat(value);
        const calculatedSeniorAmount = juniorAmount / poolRatio;

        // Ensure we don't exceed balance limits
        const maxSeniorAmount = Math.min(calculatedSeniorAmount, seniorBalance);
        setStakingSeniorAmount(maxSeniorAmount.toFixed(6));

        // If senior amount was capped, adjust junior amount accordingly
        if (calculatedSeniorAmount > seniorBalance) {
          const adjustedJuniorAmount = seniorBalance * poolRatio;
          setStakingJuniorAmount(Math.min(adjustedJuniorAmount, juniorBalance).toFixed(6));
        }
      }
    } else if (!value) {
      setStakingSeniorAmount('');
    }
  };

  const handleOptimalStaking = () => {
    // Calculate optimal amounts based on pool reserves ratio (required for addLiquidity)
    const seniorReserves = parseFloat(poolReserves.senior);
    const juniorReserves = parseFloat(poolReserves.junior);

    if (seniorReserves <= 0 || juniorReserves <= 0) {
      // Fallback to equal amounts if pool reserves are unavailable
      const maxAmount = Math.min(seniorBalance, juniorBalance);
      setStakingSeniorAmount(maxAmount.toFixed(6));
      setStakingJuniorAmount(maxAmount.toFixed(6));
      return;
    }

    // Calculate the pool ratio (how much junior per senior token)
    const poolRatio = juniorReserves / seniorReserves;

    // Find maximum stake amounts that respect the pool ratio
    const maxSeniorByBalance = seniorBalance;
    const maxJuniorForSenior = maxSeniorByBalance * poolRatio;

    const maxJuniorByBalance = juniorBalance;
    const maxSeniorForJunior = maxJuniorByBalance / poolRatio;

    // Use the limiting constraint
    let optimalSeniorAmount, optimalJuniorAmount;

    if (maxJuniorForSenior <= juniorBalance) {
      // Senior balance is the constraint
      optimalSeniorAmount = maxSeniorByBalance;
      optimalJuniorAmount = maxJuniorForSenior;
    } else {
      // Junior balance is the constraint
      optimalSeniorAmount = maxSeniorForJunior;
      optimalJuniorAmount = maxJuniorByBalance;
    }

    setStakingSeniorAmount(optimalSeniorAmount.toFixed(6));
    setStakingJuniorAmount(optimalJuniorAmount.toFixed(6));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Stake Tokens */}
      <Card className="bg-slate-800/80 border-slate-600 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center font-semibold">
            <Plus className="w-5 h-5 mr-2" />
            Stake Risk Tokens
          </CardTitle>
          <CardDescription className="text-slate-200">
            Stake your SENIOR and JUNIOR tokens to earn higher rewards from trading fees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleOptimalStaking}
              disabled={seniorBalance <= 0 && juniorBalance <= 0}
              className="bg-blue-600/20 border border-blue-500 text-blue-300 hover:bg-blue-600/30"
            >
              Preview Optimal Amounts
            </Button>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-slate-300">Auto-balance</label>
              <button
                onClick={() => setIsAutoBalancing(!isAutoBalancing)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  isAutoBalancing ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    isAutoBalancing ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-200 font-medium mb-2 block">SENIOR Amount</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={stakingSeniorAmount}
                  onChange={(e) => handleSeniorAmountChange(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                  onClick={() => handleSeniorAmountChange(seniorBalance.toString())}
                >
                  Max
                </Button>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Balance: {formatNumber(seniorBalance)}
              </p>
            </div>

            <div>
              <Label className="text-slate-200 font-medium mb-2 block">JUNIOR Amount</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={stakingJuniorAmount}
                  onChange={(e) => handleJuniorAmountChange(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                  onClick={() => handleJuniorAmountChange(juniorBalance.toString())}
                >
                  Max
                </Button>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Balance: {formatNumber(juniorBalance)}
              </p>
            </div>
          </div>

          {stakingSeniorAmount && stakingJuniorAmount && (
            <Alert className="bg-slate-700/50 border-slate-600 text-slate-300">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You'll receive staking rewards proportional to your share of the pool
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleStakeRiskTokens}
            disabled={!stakingSeniorAmount || !stakingJuniorAmount || parseFloat(stakingSeniorAmount) <= 0 || parseFloat(stakingJuniorAmount) <= 0 || isExecuting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isExecuting ? (
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Staking...
              </div>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Stake Tokens
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Unstake Tokens */}
      <Card className="bg-slate-800/80 border-slate-600 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center font-semibold">
            <Minus className="w-5 h-5 mr-2" />
            Unstake Risk Tokens
          </CardTitle>
          <CardDescription className="text-slate-200">
            Unstake your tokens from the reward pool to get back your underlying tokens. You'll receive proportional amounts of both SENIOR and JUNIOR tokens.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label className="text-slate-200 font-medium">Amount to Unstake</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.0"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                onClick={() => setUnstakeAmount(lpBalance.toString())}
              >
                Max
              </Button>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Staked Balance: {formatNumber(lpBalance)} LP tokens (${formatNumber(lpValueUSD)})
            </p>
          </div>

          {unstakeAmount && parseFloat(unstakeAmount) > 0 && (
            <Alert className="bg-slate-700/50 border-slate-600 text-slate-300">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You'll receive proportional amounts of SENIOR and JUNIOR tokens plus any earned rewards
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleUnstakeRiskTokens}
            disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0 || isExecuting}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            {isExecuting ? (
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Unstaking...
              </div>
            ) : (
              'Unstake Tokens'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Withdrawal */}
      {vaultInfo.emergencyMode && (
        <Card className="bg-red-900/20 border-red-700 backdrop-blur-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-red-400">Emergency Withdrawal</CardTitle>
            <CardDescription className="text-red-300">
              Emergency mode is active. Senior token holders can withdraw with preferred asset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="emergency-amount" className="text-slate-300 font-medium mb-2 block">CM-SENIOR Amount</Label>
                <div className="relative">
                  <Input
                    id="emergency-amount"
                    type="number"
                    placeholder="0.0"
                    value={emergencyAmount}
                    onChange={(e) => setEmergencyAmount(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                    onClick={() => setEmergencyAmount(seniorBalance.toString())}
                  >
                    Max
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-slate-300 mb-2 block font-medium">Preferred Asset</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPreferredAsset('aUSDC')}
                    className={`p-3 rounded-lg border transition-all ${
                      preferredAsset === 'aUSDC'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">aUSDC</div>
                      <div className="text-sm opacity-80">Aave USDC</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setPreferredAsset('cUSDT')}
                    className={`p-3 rounded-lg border transition-all ${
                      preferredAsset === 'cUSDT'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">cUSDT</div>
                      <div className="text-sm opacity-80">Compound USDT</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <Button
              onClick={handleEmergencyWithdraw}
              disabled={!emergencyAmount || isExecuting}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isExecuting ? (
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </div>
              ) : (
                'Emergency Withdraw'
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedFeatures;
