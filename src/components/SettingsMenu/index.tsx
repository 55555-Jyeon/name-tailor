'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import { LANGUAGES } from '@/locales';
import { useSettings } from '@/providers/SettingsProvider';
import { useTranslation } from '@/hooks/useTranslation';
import type { SegmentOption, SegmentProps } from './type';
import type { LanguagePreference, ThemePreference } from '@/providers/SettingsProvider/type';

const Segment = <T extends string>({ label, options, selected, onSelect }: SegmentProps<T>) => (
  <div className={styles.group}>
    <p className={styles.groupLabel}>{label}</p>
    <div className={styles.segment} role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={selected === option.value}
          className={`${styles.option} ${selected === option.value ? styles.active : ''}`}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const SettingsMenu = () => {
  const { themePreference, setThemePreference, languagePreference, setLanguagePreference } = useSettings();
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on a click outside the menu or on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const themeOptions: SegmentOption<ThemePreference>[] = [
    { value: 'light', label: `☀️ ${t.settings.light}` },
    { value: 'dark', label: `🌙 ${t.settings.dark}` },
    { value: 'system', label: `🖥️ ${t.settings.system}` },
  ];

  const languageOptions: SegmentOption<LanguagePreference>[] = [
    ...LANGUAGES,
    { value: 'system', label: t.settings.browserLanguage },
  ];

  return (
    <div className={styles.menu} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={t.settings.open}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title={t.settings.open}
      >
        ⚙️
      </button>

      {isOpen && (
        <div className={styles.popover} role="dialog" aria-label={t.settings.open}>
          <Segment
            label={t.settings.theme}
            options={themeOptions}
            selected={themePreference}
            onSelect={setThemePreference}
          />
          <Segment
            label={t.settings.language}
            options={languageOptions}
            selected={languagePreference}
            onSelect={setLanguagePreference}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
