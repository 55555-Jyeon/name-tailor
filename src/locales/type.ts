export type Language = 'ko' | 'en';

export type ErrorCode = 'quotaExceeded' | 'busy' | 'unknown';

export interface Dictionary {
  subtitle: string;
  form: {
    contextLabel: string;
    contextPlaceholder: string;
    roleLabel: string;
    caseLabel: string;
    generate: string;
    generating: string;
  };
  roles: Record<string, string>;
  results: {
    count: (count: number) => string;
    clearAll: string;
    clearConfirm: string;
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
