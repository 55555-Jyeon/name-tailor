'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import type { ResultPanelProps } from './type';
import { useNameStore } from '@/store/useNameStore';
import ResultCard from '@/components/ResultCard';
import { useTranslation } from '@/hooks/useTranslation';

// Only this panel scrolls; the form stays fixed in place
const ResultPanel = ({ onReuse }: ResultPanelProps) => {
  const { results, isLoading, removeResult, removeSuggestion, clearResults } = useNameStore();
  const t = useTranslation();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  // The scrollbar is hidden, so fade the bottom edge while there is more to scroll to
  const updateHasMoreBelow = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;
    setHasMoreBelow(body.scrollTop + body.clientHeight < body.scrollHeight - 1);
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    updateHasMoreBelow();
    const observer = new ResizeObserver(updateHasMoreBelow);
    observer.observe(body);
    return () => observer.disconnect();
  }, [updateHasMoreBelow]);

  // Cards being added or removed changes the content height
  useEffect(updateHasMoreBelow, [results, isLoading, updateHasMoreBelow]);

  // Count individual names, not generations, so removing one name updates the total
  const nameCount = results.reduce((total, result) => total + result.suggestions.length, 0);

  const handleClearAll = () => {
    if (window.confirm(t.results.clearConfirm)) clearResults();
  };

  return (
    <section className={styles.panel} aria-label="Generated names">
      {results.length > 0 && (
        <div className={styles.header}>
          <span className={styles.count}>
            {t.results.count(nameCount)}
          </span>
          <button type="button" className={styles.clearBtn} onClick={handleClearAll}>
            {t.results.clearAll}
          </button>
        </div>
      )}
      <div
        ref={bodyRef}
        className={`${styles.body} ${hasMoreBelow ? styles.fadeBottom : ''}`}
        onScroll={updateHasMoreBelow}
      >
        {isLoading && results.length > 0 && (
          <div className={styles.loading}>
            {t.results.loading}
          </div>
        )}

        {results.length > 0 && (
          <div className={styles.results}>
            {results.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onClose={() => removeResult(result.id)}
                onRemoveSuggestion={(name) => removeSuggestion(result.id, name)}
                onReuse={() => onReuse(result)}
              />
            ))}
          </div>
        )}

        {/* Before the first result the whole area is one frame: the spinner sits in its center,
            and once idle a gradient sweeps around the border to invite the next request */}
        {results.length === 0 && (
          <div className={`${styles.stage} ${isLoading ? '' : styles.sweep}`}>
            {isLoading ? (
              <div className={styles.loading}>{t.results.loading}</div>
            ) : (
              <p className={styles.empty}>{t.results.empty}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultPanel;
