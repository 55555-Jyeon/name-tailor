'use client';

import styles from './style.module.scss';
import { LANGUAGES } from '@/locales';
import { useSettings } from '@/providers/SettingsProvider';
import { useTranslation } from '@/hooks/useTranslation';

const LanguageToggle = () => {
  const { language, setLanguage } = useSettings();
  const t = useTranslation();

  return (
    <div className={styles.toggle} role="group" aria-label={t.toggles.language}>
      {LANGUAGES.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.option} ${language === option.value ? styles.active : ''}`}
          onClick={() => setLanguage(option.value)}
          aria-pressed={language === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
