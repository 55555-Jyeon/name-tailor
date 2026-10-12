'use client';

import { createContext, useContext, useState } from 'react';
import { COOKIE_MAX_AGE, THEME_COOKIE } from './constant';
import type { SettingsContextValue, SettingsProviderProps, Theme } from './type';

const SettingsContext = createContext<SettingsContextValue | null>(null);

// Settings live in cookies so the server can render the right theme on the first paint
const saveCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
};

const SettingsProvider = ({ initialTheme, children }: SettingsProviderProps) => {
  const [theme, setThemeState] = useState<Theme | null>(initialTheme);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    saveCookie(THEME_COOKIE, next);
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme }}>
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
