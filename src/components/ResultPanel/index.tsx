'use client';

import styles from './style.module.scss';
import type { ResultPanelProps } from './type';
import { useNameStore } from '@/store/useNameStore';
import ResultCard from '@/components/ResultCard';

// Only this panel scrolls; the form stays fixed in place
const ResultPanel = ({ onReuse }: ResultPanelProps) => {
  const { results, isLoading, removeResult, clearResults } = useNameStore();

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
      <div className={styles.body}>
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
