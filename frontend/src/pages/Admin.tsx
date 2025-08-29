
import { useWeb3 } from '@/context/PrivyWeb3Context';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, RefreshCw, PlayCircle, Settings, Activity } from 'lucide-react';
import { Phase, PHASE_NAMES } from '@/config/contracts';

const Admin = () => {
  const {
    isConnected,
    address,
    vaultInfo,
    toggleEmergencyMode,
    forcePhaseTransition,
    forcePhaseTransitionImmediate,
    startNewCycle,
    refreshData,
    seniorTokenAddress,
    juniorTokenAddress,
  } = useWeb3();

  // Helper function to format time remaining
  const formatTimeRemaining = (timeRemainingBigInt: bigint): string => {
    const timeRemaining = Number(timeRemainingBigInt);
    if (timeRemaining <= 0) return "0s";
    
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 right-20 w-60 h-60 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <Navbar />
        <div className="relative z-10 container mx-auto px-6 py-8">
          <Alert className="bg-slate-800/50 border-slate-700 text-slate-300">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to access admin functions
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-300">
            Simulate realistic scenarios with these administration and emergency controls.
          </p>
        </div>

        <Alert className="mb-6 bg-red-900/20 border-red-700 backdrop-blur-sm" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-300">
            <strong>Warning:</strong> Admin functions can significantly affect protocol operation. Use with caution.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">

          {/* Protocol Status */}
          {/* Protocol Status */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Protocol Status
              </CardTitle>
              <CardDescription className="text-slate-300">Current protocol state and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Current Phase</p>
                  <p className="text-lg font-semibold text-white">{PHASE_NAMES[vaultInfo.currentPhase as Phase]}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Emergency Mode</p>
                  <p className={`text-lg font-semibold ${vaultInfo.emergencyMode ? 'text-red-400' : 'text-green-400'}`}>
                    {vaultInfo.emergencyMode ? '🚨 Active' : '✅ Inactive'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Value Locked</p>
                  <p className="text-lg font-semibold text-white">
                    ${((Number(vaultInfo.aUSDCBalance) + Number(vaultInfo.cUSDTBalance)) / 1e18).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Tokens Issued</p>
                  <p className="text-lg font-semibold text-white">
                    {(Number(vaultInfo.totalTokensIssued) / 1e18).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Admin Address</p>
                    <p className="text-sm font-mono text-slate-300">{address}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={refreshData}
                      variant="outline"
                      size="sm"
                      className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Phase Management */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Phase Management</CardTitle>
              <CardDescription className="text-slate-300">
                Control protocol lifecycle phases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-slate-400 mb-2">Phase Progression:</p>
                <div className="flex items-center space-x-2 text-sm mb-2">
                  <span className={Number(vaultInfo.currentPhase) === Phase.ACTIVE ? 'font-bold text-white' : 'text-slate-300'}>
                    Active Period (5d)
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className={Number(vaultInfo.currentPhase) === Phase.CLAIMS ? 'font-bold text-white' : 'text-slate-300'}>
                    Claims Period (1d)
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className={Number(vaultInfo.currentPhase) === Phase.FINAL_CLAIMS ? 'font-bold text-white' : 'text-slate-300'}>
                    Final Claims Period (1d)
                  </span>
                </div>
                <div className="flex items-center justify-center mt-2">
                  <span className="text-slate-400 text-xs">↓ Manual cycle restart required ↓</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={forcePhaseTransitionImmediate}
                  variant="outline"
                  disabled={Number(vaultInfo.currentPhase) === Phase.FINAL_CLAIMS}
                  className={`w-full ${
                    Number(vaultInfo.currentPhase) === Phase.FINAL_CLAIMS
                      ? 'bg-slate-600 cursor-not-allowed opacity-50 text-slate-400 border-slate-600'
                      : 'bg-orange-700 hover:bg-orange-600 text-white border-orange-600 hover:border-orange-500'
                  }`}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Force Phase Transition (Immediate)
                </Button>
                
                {Number(vaultInfo.currentPhase) === Phase.FINAL_CLAIMS && (
                  <Alert className="bg-amber-900/20 border-amber-700 text-amber-300">
                    <AlertDescription className="text-xs">
                      Force phase transition cannot proceed from Final Claims. Use "Start New Cycle" instead.
                    </AlertDescription>
                  </Alert>
                )}

                {Number(vaultInfo.currentPhase) === Phase.FINAL_CLAIMS && (
                  <div className="space-y-2">
                    <Button
                      onClick={startNewCycle}
                      variant="default"
                      disabled={Number(vaultInfo.timeRemaining) > 0}
                      className={`w-full ${
                        Number(vaultInfo.timeRemaining) > 0
                          ? 'bg-slate-600 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                      }`}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {Number(vaultInfo.timeRemaining) > 0 ? 'Start New Cycle' : 'Start New Cycle (Ready)'}
                    </Button>
                    {Number(vaultInfo.timeRemaining) > 0 && (
                      <Alert className="bg-blue-900/20 border-blue-700 text-blue-300">
                        <AlertDescription className="text-xs">
                          Final Claims period must complete. Time remaining: {formatTimeRemaining(vaultInfo.timeRemaining)}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
                
                {Number(vaultInfo.currentPhase) !== Phase.FINAL_CLAIMS && (
                  <Button
                    variant="default"
                    disabled={true}
                    className="w-full bg-slate-600 cursor-not-allowed opacity-50"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start New Cycle (Only available in Final Claims)
                  </Button>
                )}
              </div>

              <Alert className="bg-slate-700/50 border-slate-600 text-slate-300">
                <AlertDescription className="text-xs">
                  <strong>Note:</strong> Starting a new cycle requires the Final Claims period (1 day) to be completed and can only be initiated from that phase.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Emergency Controls */}
          <Card className="bg-red-900/20 border-red-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-400">Emergency Controls</CardTitle>
              <CardDescription className="text-red-300">
                Emergency mode prioritizes senior token withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="bg-slate-700/50 border-slate-600 text-slate-300">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Emergency mode is currently: <strong>{vaultInfo.emergencyMode ? 'ACTIVE' : 'INACTIVE'}</strong>
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={toggleEmergencyMode}
                  variant={vaultInfo.emergencyMode ? "outline" : "destructive"}
                  className={vaultInfo.emergencyMode ? "w-full bg-slate-700 hover:bg-slate-600 text-white border-slate-600 hover:border-slate-500" : "w-full bg-red-600 hover:bg-red-700"}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {vaultInfo.emergencyMode ? 'Deactivate' : 'Activate'} Emergency Mode
                </Button>
              </div>
            </CardContent>
          </Card>


          {/* Contract Information */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Contract Information
              </CardTitle>
              <CardDescription className="text-slate-300">Protocol contract addresses and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                  <span className="text-slate-400">Senior Token:</span>
                  <span className="font-mono text-slate-300 text-xs">{seniorTokenAddress}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                  <span className="text-slate-400">Junior Token:</span>
                  <span className="font-mono text-slate-300 text-xs">{juniorTokenAddress}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Guidelines */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Admin Guidelines & Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-2">Emergency Procedures</h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Emergency mode should only be activated when yield sources experience significant losses</li>
                    <li>• Monitor liquidity pools for unusual activity</li>
                    <li>• Coordinate with governance before major protocol changes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Phase Management</h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Phase transitions normally occur automatically based on time</li>
                    <li>• Force phase transition works for Active → Claims → Final Claims only</li>
                    <li>• Force transition is disabled in Final Claims phase</li>
                    <li>• Starting a new cycle requires completion of Final Claims period (1 day)</li>
                    <li>• New cycles reset the protocol to Active phase</li>
                  </ul>
                </div>
              </div>
              
              <Alert className="bg-amber-900/20 border-amber-700 text-amber-300 mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Only the contract owner can access these functions. All admin actions are logged on-chain and should be justified to the community.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
