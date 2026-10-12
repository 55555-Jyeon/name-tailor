'use client';

import { createContext, useContext, useState } from 'react';
import { COOKIE_MAX_AGE, LANGUAGE_COOKIE, THEME_COOKIE } from './constant';
import type { LanguagePreference, SettingsContextValue, SettingsProviderProps, ThemePreference } from './type';
import type { Language } from '@/locales/type';
import { detectLanguage } from '@/locales';

const SettingsContext = createContext<SettingsContextValue | null>(null);

// Settings live in cookies so the server can render the right theme and language on the first paint.
// 'system' is stored by removing the cookie, which makes the server fall back to the OS/browser.
const saveCookie = (name: string, value: string) => {
  if (value === 'system') {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
    return;
  }
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
};

const SettingsProvider = ({
  initialThemePreference,
  initialLanguagePreference,
  initialLanguage,
  children,
}: SettingsProviderProps) => {
  const [themePreference, setThemeState] = useState<ThemePreference>(initialThemePreference);
  const [languagePreference, setLanguagePreferenceState] = useState<LanguagePreference>(initialLanguagePreference);
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const setThemePreference = (next: ThemePreference) => {
    setThemeState(next);
    // Without data-theme the CSS falls back to prefers-color-scheme
    if (next === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
    saveCookie(THEME_COOKIE, next);
  };

  const setLanguagePreference = (next: LanguagePreference) => {
    const resolved = next === 'system' ? detectLanguage(navigator.languages.join(',')) : next;
    setLanguagePreferenceState(next);
    setLanguage(resolved);
    document.documentElement.lang = resolved;
    saveCookie(LANGUAGE_COOKIE, next);
  };

  return (
    <SettingsContext.Provider
      value={{ themePreference, setThemePreference, languagePreference, language, setLanguagePreference }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used inside SettingsProvider');
  return context;
};

export { useSettings };
export default SettingsProvider;
