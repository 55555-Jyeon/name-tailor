'use client';

import { useEffect, useState } from 'react';
import styles from './ResultCard.module.scss';
import { getRoleLabel } from '@/constants/options';
import type { GenerationResult } from '@/store/useNameStore';

interface ResultCardProps {
  result: GenerationResult;
  onClose: () => void;
  onReuse: () => void;
}

function copyWithTextarea(text: string) {
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
}

export default function ResultCard({ result, onClose, onReuse }: ResultCardProps) {
  const [copiedName, setCopiedName] = useState<string | null>(null);

  // Put the "Copied" label back after a moment
  useEffect(() => {
    if (!copiedName) return;
    const timer = setTimeout(() => setCopiedName(null), 1500);
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

  const time = new Date(result.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <p className={styles.context}>{result.context}</p>
          <p className={styles.tags}>
            {getRoleLabel(result.role)} · {result.namingCase} · {time}
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.reuseBtn} onClick={onReuse} title="Fill the form with these inputs">
            ↺ Reuse
          </button>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Close" title="Close">
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
                aria-label={`Copy ${item.name}`}
              >
                {copiedName === item.name ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <p className={styles.explanation}>{item.explanation}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
