'use client';

import styles from './page.module.scss';
import { useNameStore } from '@/store/useNameStore';
import { useGenerateNames } from '@/hooks/useGenerateNames';

export default function Home() {
  const { context, role, namingCase, suggestions, isLoading, setContext, setRole, setNamingCase } = useNameStore();
  const generateNames = useGenerateNames();

  const handleGenerate = () => {
    if (!context.trim()) return;
    generateNames.mutate({ context, role, namingCase });
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Name Tailor</h1>
        <p className={styles.subtitle}>
          AI-powered naming assistant for developers. Never struggle with variable or function names again.
        </p>
      </div>

      <div className={styles.glassCard}>
        <div className={styles.formGroup}>
          <label htmlFor="context">What does it do?</label>
          <input 
            type="text" 
            id="context" 
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
            <option value="variable">Variable</option>
            <option value="function">Function</option>
            <option value="component">Component (React/Vue/etc)</option>
            <option value="class">Class</option>
            <option value="hook">React Hook</option>
            <option value="file">File Name</option>
            <option value="directory">Directory Name</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="case">Naming Convention</label>
          <select 
            id="case" 
            value={namingCase}
            onChange={(e) => setNamingCase(e.target.value)}
          >
            <option value="camelCase">camelCase (myVariable)</option>
            <option value="PascalCase">PascalCase (MyClass)</option>
            <option value="snake_case">snake_case (my_variable)</option>
            <option value="kebab-case">kebab-case (my-file-name)</option>
            <option value="UPPER_SNAKE_CASE">UPPER_SNAKE_CASE (MY_CONSTANT)</option>
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

        {isLoading && (
          <div className={styles.loading}>
            Crafting the perfect names...
          </div>
        )}

        {!isLoading && suggestions.length > 0 && (
          <div className={styles.results}>
            {suggestions.map((item, idx) => (
              <div key={idx} className={styles.resultItem}>
                <div className={styles.resultName}>{item.name}</div>
                <div className={styles.resultExplanation}>{item.explanation}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

