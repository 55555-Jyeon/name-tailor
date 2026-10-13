'use client';

import styles from './style.module.scss';
import type { NameFormProps } from './type';
import { useNameStore } from '@/store/useNameStore';
import { useGenerateNames } from '@/hooks/useGenerateNames';
import { useTranslation } from '@/hooks/useTranslation';
import { CASE_OPTIONS, ROLE_OPTIONS } from '@/constants/option';

const NameForm = ({ inputRef }: NameFormProps) => {
  const { context, role, namingCase, isLoading, error, setContext, setRole, setNamingCase } = useNameStore();
  const generateNames = useGenerateNames();
  const t = useTranslation();

  const isSubmitDisabled = isLoading || !context.trim();

  const handleGenerate = () => {
    if (isSubmitDisabled) return;
    generateNames.mutate({ context, role, namingCase });
  };

  return (
    <section className={styles.panel}>
      <div className={styles.formGroup}>
        <label htmlFor="context">{t.form.contextLabel}</label>
        <input
          type="text"
          id="context"
          ref={inputRef}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder={t.form.contextPlaceholder}
          autoComplete="off"
          onKeyDown={(e) => {
            // While a Korean/Japanese IME is composing, Enter only confirms the syllable
            if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
            handleGenerate();
          }}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="role">{t.form.roleLabel}</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLE_OPTIONS.map((value) => (
            <option key={value} value={value}>{t.roles[value]}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="case">{t.form.caseLabel}</label>
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
        disabled={isSubmitDisabled}
        style={{ opacity: isSubmitDisabled ? 0.7 : 1, cursor: isSubmitDisabled ? 'not-allowed' : 'pointer' }}
      >
        {isLoading ? t.form.generating : t.form.generate}
      </button>

      {!isLoading && error && (
        <div className={styles.error} role="alert">
          {t.errors[error]}
        </div>
      )}
    </section>
  );
};

export default NameForm;
