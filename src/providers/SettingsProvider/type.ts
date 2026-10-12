import type { ReactNode } from 'react';
import type { Language } from '@/locales/type';

export type Theme = 'light' | 'dark';

// 'system' follows the OS theme / browser language instead of a fixed choice
export type ThemePreference = Theme | 'system';

export type LanguagePreference = Language | 'system';

export interface SettingsContextValue {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  languagePreference: LanguagePreference;
  // The language actually shown (resolved from the browser when the preference is 'system')
  language: Language;
  setLanguagePreference: (preference: LanguagePreference) => void;
}

export interface SettingsProviderProps {
  initialThemePreference: ThemePreference;
  initialLanguagePreference: LanguagePreference;
  initialLanguage: Language;
  children: ReactNode;
}
