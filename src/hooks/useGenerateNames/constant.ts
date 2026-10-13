import type { ErrorCode } from '@/locales/type';

// Maps the status code /api/generate returns to the message shown to the user
export const getErrorCode = (status: number): ErrorCode => {
  if (status === 429) return 'quotaExceeded';
  if (status === 503 || status === 504) return 'busy';
  return 'unknown';
};

const ERROR_CODES: ErrorCode[] = ['quotaExceeded', 'busy', 'unknown'];

const isErrorCode = (value: string): value is ErrorCode => ERROR_CODES.includes(value as ErrorCode);

// mutationFn throws Error(errorCode) for server errors, but fetch itself can fail
// (offline, aborted) with a message that is not one of our codes
export const toErrorCode = (error: Error): ErrorCode =>
  isErrorCode(error.message) ? error.message : 'unknown';
