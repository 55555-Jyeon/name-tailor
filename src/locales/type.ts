import type { FunctionRule } from '@/types/name';

export type Language = 'ko' | 'en';

export type ErrorCode = 'quotaExceeded' | 'busy' | 'unknown';

export interface Dictionary {
  subtitle: string;
  form: {
    contextLabel: string;
    contextPlaceholder: string;
    roleLabel: string;
    caseLabel: string;
    requiredWordsLabel: string;
    requiredWordsHint: (max: number) => string;
    requiredWordsPlaceholder: string;
    requiredWordsAdd: string;
    requiredWordsRemove: (word: string) => string;
    functionRulesLabel: string;
    generate: string;
    generating: string;
  };
  roles: Record<string, string>;
  cases: Record<string, string>;
  // label: checkbox text, example: sample name beside it, short: tag on result cards
  functionRules: Record<FunctionRule, { label: string; example: string; short: string }>;
  results: {
    count: (count: number) => string;
    panelLabel: string;
    clearAll: string;
    clearConfirm: string;
    clearConfirmDescription: string;
    clearConfirmAction: string;
    cancel: string;
    loading: string;
    empty: string;
  };
  card: {
    reuse: string;
    reuseTitle: string;
    close: string;
    copy: string;
    copied: string;
    copyLabel: (name: string) => string;
    removeLabel: (name: string) => string;
    removeTitle: string;
    words: string;
    requiredWords: string;
  };
  errors: Record<ErrorCode, string>;
  settings: {
    open: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
    language: string;
    browserLanguage: string;
  };
}
