// Trading and DeFi Constants
export const SLIPPAGE_TOLERANCE = 0.95; // 5% slippage
export const SLIPPAGE_PERCENT_BIGINT = 95n; // 95% (5% slippage) for BigInt calculations
export const PERCENTAGE_DIVISOR_BIGINT = 100n; // 100% divisor for BigInt
export const TRANSACTION_DEADLINE_MINUTES = 20;
export const WEI_PRECISION = 1e18;
export const PERCENTAGE_PRECISION = 100;
export const BASIS_POINT = 10000; // For 0.01% precision

// Risk Profile Thresholds
export const RISK_THRESHOLDS = {
  CONSERVATIVE: 0.8,
  MODERATE: 0.6,
  BALANCED: 0.4,
  GROWTH: 0.2,
} as const;

// Refresh Intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  PRICING_UPDATE: 30000, // 30 seconds
  DATA_REFRESH_DEFAULT: 4000, // 4 seconds
  DATA_REFRESH_HEDERA: 8000, // 8 seconds for Hedera (rate limiting)
  DEBOUNCE_DELAY: 500, // 0.5 seconds
} as const;

// Pool Reserve Precision
export const POOL_RESERVE_MIN_CHANGE = 0.01; // Minimum change to update reserves