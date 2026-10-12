'use client';

import { useEffect, useRef } from 'react';
import styles from './style.module.scss';
import { useNameStore, type GenerationResult } from '@/store/useNameStore';
import NameForm from '@/components/NameForm';
import ResultPanel from '@/components/ResultPanel';

const Home = () => {
  const { setContext, setRole, setNamingCase } = useNameStore();
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

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Name Tailor</h1>
        <p className={styles.subtitle}>AI-powered naming assistant for developers</p>
      </header>

      <div className={styles.workspace}>
        <NameForm inputRef={contextInputRef} />
        <ResultPanel onReuse={handleReuse} />
      </div>
    </main>
  );
};

export default Home;
