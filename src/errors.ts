export const errors = Object.freeze({
  NO_ERROR: 0,
  UNKNOWN_ERROR: 1,
  IMMATURE_ACCOUNT: 2,
  INVALID_REQUEST: 3,
} as const);

export type ErrorCode = typeof errors[keyof typeof errors];
