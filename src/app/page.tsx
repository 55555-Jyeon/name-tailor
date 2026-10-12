'use client';

import { useEffect, useRef } from 'react';
import styles from './page.module.scss';
import { useNameStore, type GenerationResult } from '@/store/useNameStore';
import { useGenerateNames } from '@/hooks/useGenerateNames';
import { CASE_OPTIONS, ROLE_OPTIONS } from '@/constants/options';
import ResultCard from '@/components/ResultCard';

export default function Home() {
  const {
    context, role, namingCase, results, isLoading, error,
    setContext, setRole, setNamingCase, removeResult, clearResults,
  } = useNameStore();
  const generateNames = useGenerateNames();
  const contextInputRef = useRef<HTMLInputElement>(null);

  // Restore saved result cards from localStorage after the first render
  useEffect(() => {
    useNameStore.persist.rehydrate();
  }, []);

  // Put a card's inputs back into the form so they can be tweaked and regenerated
  const handleReuse = (result: GenerationResult) => {
    setContext(result.context);
    setRole(result.role);
    setNamingCase(result.namingCase);
    contextInputRef.current?.focus();
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all generated names?')) clearResults();
  };

  const handleGenerate = () => {
    if (!context.trim()) return;
    generateNames.mutate({ context, role, namingCase });
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Name Tailor</h1>
        <p className={styles.subtitle}>AI-powered naming assistant for developers</p>
      </header>

      <div className={styles.workspace}>
        <section className={`${styles.glassCard} ${styles.formPanel}`}>
          <div className={styles.formGroup}>
            <label htmlFor="context">What does it do?</label>
            <input 
              type="text" 
              id="context" 
              ref={contextInputRef}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., Fetches user profile data from the server" 
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate();
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">What is this for?</label>
            <select 
              id="role" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="case">Naming Convention</label>
            <select 
              id="case" 
              value={namingCase}
              onChange={(e) => setNamingCase(e.target.value)}
            >
              {CASE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <button 
            className={styles.submitBtn} 
            onClick={handleGenerate}
            disabled={isLoading || !context.trim()}
            style={{ opacity: (isLoading || !context.trim()) ? 0.7 : 1, cursor: (isLoading || !context.trim()) ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Generating...' : 'Generate Names ✨'}
          </button>

          {!isLoading && error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}
        </section>

        {/* Only this panel scrolls; the form stays fixed in place */}
        <section className={`${styles.glassCard} ${styles.resultsPanel}`} aria-label="Generated names">
          {results.length > 0 && (
            <div className={styles.resultsHeader}>
              <span className={styles.resultsCount}>
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </span>
              <button type="button" className={styles.clearBtn} onClick={handleClearAll}>
                Clear all
              </button>
            </div>
          )}
          <div className={styles.resultsBody}>
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
                    onReuse={() => handleReuse(result)}
                  />
                ))}
              </div>
            )}

            {!isLoading && results.length === 0 && (
              <p className={styles.empty}>Generated names will stack up here.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

