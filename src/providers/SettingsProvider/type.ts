import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark';

export interface SettingsContextValue {
  // null means no choice was made yet, so the OS setting is followed
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
}

export interface SettingsProviderProps {
  initialTheme: Theme | null;
  children: ReactNode;
}
