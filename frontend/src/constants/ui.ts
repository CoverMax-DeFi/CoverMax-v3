// UI Constants
export const RISK_PROFILE_COLORS = {
  None: 'slate',
  Conservative: 'blue', 
  Moderate: 'purple',
  Balanced: 'green',
  Growth: 'yellow',
  Aggressive: 'red',
} as const;

export const RISK_PROFILE_LABELS = {
  NONE: 'None',
  CONSERVATIVE: 'Conservative',
  MODERATE: 'Moderate', 
  BALANCED: 'Balanced',
  GROWTH: 'Growth',
  AGGRESSIVE: 'Aggressive',
} as const;

// Format defaults
export const DEFAULT_DECIMAL_PLACES = 2;
export const TOKEN_DECIMAL_PLACES = 18;
export const PERCENTAGE_DECIMAL_PLACES = 1;

// Address display format
export const ADDRESS_DISPLAY_LENGTH = {
  START: 6,
  END: 4,
} as const;