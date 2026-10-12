'use client';

import styles from './style.module.scss';
import { useSettings } from '@/providers/SettingsProvider';

const ThemeToggle = () => {
  const { theme, setTheme } = useSettings();

  const handleToggle = () => {
    // Without a saved choice the page follows the OS, so start from what is showing now
    const current = theme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  // Both icons are rendered and CSS shows the one for the active theme,
  // so the server render matches even when the theme comes from the OS
  return (
    <button type="button" className={styles.toggle} onClick={handleToggle} aria-label="Toggle dark mode" title="Toggle dark mode">
      <span className={styles.sun} aria-hidden="true">☀️</span>
      <span className={styles.moon} aria-hidden="true">🌙</span>
    </button>
  );
};

export default ThemeToggle;
