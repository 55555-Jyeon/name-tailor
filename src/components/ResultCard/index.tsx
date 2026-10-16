'use client';

import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import type { ResultCardProps } from './type';
import { COPIED_LABEL_MS } from './constant';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettings } from '@/providers/SettingsProvider';

const copyWithTextarea = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  return copied;
};

const ResultCard = ({ result, onClose, onRemoveSuggestion, onReuse }: ResultCardProps) => {
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const { language } = useSettings();
  const t = useTranslation();

  // Put the "Copied" label back after a moment
  useEffect(() => {
    if (!copiedName) return;
    const timer = setTimeout(() => setCopiedName(null), COPIED_LABEL_MS);
    return () => clearTimeout(timer);
  }, [copiedName]);

  const handleCopy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedName(name);
    } catch {
      // Clipboard API can be blocked (e.g. embedded browsers); fall back to the legacy copy command
      if (copyWithTextarea(name)) setCopiedName(name);
      else console.error('Failed to copy name:', name);
    }
  };

  const time = new Date(result.createdAt).toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <p className={styles.context}>{result.context}</p>
          <p className={styles.tags}>
            {[
              t.roles[result.role] ?? result.role,
              result.namingCase,
              ...(result.functionRules ?? []).map((rule) => t.functionRules[rule]?.short ?? rule),
              time,
            ].join(' · ')}
          </p>
          {result.requiredWords && result.requiredWords.length > 0 && (
            <ul className={styles.requiredWords} aria-label={t.card.requiredWords}>
              {result.requiredWords.map((word) => (
                <li key={word} className={styles.requiredWord}>{word}</li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.reuseBtn} onClick={onReuse} title={t.card.reuseTitle}>
            {t.card.reuse}
          </button>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label={t.card.close} title={t.card.close}>
            ✕
          </button>
        </div>
      </header>

      <ul className={styles.suggestions}>
        {result.suggestions.map((item) => (
          <li key={item.name} className={styles.suggestion}>
            <div className={styles.nameRow}>
              <code className={styles.name}>{item.name}</code>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => handleCopy(item.name)}
                aria-label={t.card.copyLabel(item.name)}
              >
                {copiedName === item.name ? t.card.copied : t.card.copy}
              </button>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemoveSuggestion(item.name)}
                aria-label={t.card.removeLabel(item.name)}
                title={t.card.removeTitle}
              >
                ✕
              </button>
            </div>
            <p className={styles.explanation}>
              {language === 'ko' && item.explanationKo ? item.explanationKo : item.explanation}
            </p>
            {item.words && item.words.length > 0 && (
              <details className={styles.words}>
                <summary className={styles.wordsToggle}>{t.card.words}</summary>
                <ul className={styles.wordList}>
                  {item.words.map(({ word, definition, definitionKo }, index) => (
                    <li key={`${word}-${index}`} className={styles.word}>
                      <code className={styles.wordTerm}>{word}</code>
                      <span>{language === 'ko' ? definitionKo : definition}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default ResultCard;
