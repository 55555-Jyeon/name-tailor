'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import type { ResultPanelProps } from './type';
import { useNameStore } from '@/store/useNameStore';
import ResultCard from '@/components/ResultCard';

// Only this panel scrolls; the form stays fixed in place
const ResultPanel = ({ onReuse }: ResultPanelProps) => {
  const { results, isLoading, removeResult, clearResults } = useNameStore();
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

  const handleClearAll = () => {
    if (window.confirm('Remove all generated names?')) clearResults();
  };

  return (
    <section className={styles.panel} aria-label="Generated names">
      {results.length > 0 && (
        <div className={styles.header}>
          <span className={styles.count}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </span>
          <button type="button" className={styles.clearBtn} onClick={handleClearAll}>
            Clear all
          </button>
        </div>
      )}
      <div
        ref={bodyRef}
        className={`${styles.body} ${hasMoreBelow ? styles.fadeBottom : ''}`}
        onScroll={updateHasMoreBelow}
      >
        {isLoading && (
          <div className={styles.loading}>
            Crafting the perfect names...
          </div>
        )}

        {results.length > 0 && (
          <div className={styles.results}>
            {results.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onClose={() => removeResult(result.id)}
                onReuse={() => onReuse(result)}
              />
            ))}
          </div>
        )}

        {!isLoading && results.length === 0 && (
          <p className={styles.empty}>Generated names will stack up here.</p>
        )}
      </div>
    </section>
  );
};

export default ResultPanel;
