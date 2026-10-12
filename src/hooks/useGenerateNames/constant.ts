import type { ErrorCode } from '@/locales/type';

// Maps the status code /api/generate returns to the message shown to the user
export const getErrorCode = (status: number): ErrorCode => {
  if (status === 429) return 'quotaExceeded';
  if (status === 503 || status === 504) return 'busy';
  return 'unknown';
};
