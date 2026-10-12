'use client';

import { useEffect, useRef } from 'react';
import styles from './style.module.scss';
import { useNameStore } from '@/store/useNameStore';
import type { GenerationResult } from '@/types/name';
import NameForm from '@/components/NameForm';
import ResultPanel from '@/components/ResultPanel';
import SettingsMenu from '@/components/SettingsMenu';
import { useTranslation } from '@/hooks/useTranslation';

const Home = () => {
  const { setContext, setRole, setNamingCase } = useNameStore();
  const contextInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslation();

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
        <p className={styles.subtitle}>{t.subtitle}</p>
        <div className={styles.controls}>
          <SettingsMenu />
        </div>
      </header>

      <div className={styles.workspace}>
        <NameForm inputRef={contextInputRef} />
        <ResultPanel onReuse={handleReuse} />
      </div>
    </main>
  );
};

export default Home;
