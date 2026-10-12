import type { ReactNode } from 'react';
import type { Language } from '@/locales/type';

export type Theme = 'light' | 'dark';

export interface SettingsContextValue {
  // null means no choice was made yet, so the OS setting is followed
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

export interface SettingsProviderProps {
  initialTheme: Theme | null;
  initialLanguage: Language;
  children: ReactNode;
}
