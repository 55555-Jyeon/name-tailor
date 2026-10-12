import styles from './ResultCard.module.scss';
import { getRoleLabel } from '@/constants/options';
import type { GenerationResult } from '@/store/useNameStore';

interface ResultCardProps {
  result: GenerationResult;
  onClose: () => void;
}

export default function ResultCard({ result, onClose }: ResultCardProps) {
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
        <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Close" title="Close">
          ✕
        </button>
      </header>

      <ul className={styles.suggestions}>
        {result.suggestions.map((item) => (
          <li key={item.name} className={styles.suggestion}>
            <code className={styles.name}>{item.name}</code>
            <p className={styles.explanation}>{item.explanation}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
