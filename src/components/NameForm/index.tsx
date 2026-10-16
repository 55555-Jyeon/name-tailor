'use client';

import { useShallow } from 'zustand/react/shallow';
import styles from './style.module.scss';
import type { NameFormProps } from './type';
import { useNameStore } from '@/store/useNameStore';
import { useGenerateNames } from '@/hooks/useGenerateNames';
import { useTranslation } from '@/hooks/useTranslation';
import { CASE_OPTIONS, MAX_REQUIRED_WORD_LENGTH, MAX_REQUIRED_WORDS, ROLE_OPTIONS } from '@/constants/option';
import Select from '@/components/Select';
import ChipInput from '@/components/ChipInput';

const NameForm = ({ inputRef }: NameFormProps) => {
  // Picks only what the form uses, so new result cards don't re-render it
  const {
    context,
    role,
    namingCase,
    requiredWords,
    isLoading,
    error,
    setContext,
    setRole,
    setNamingCase,
    addRequiredWord,
    removeRequiredWord,
  } = useNameStore(
    useShallow((state) => ({
      context: state.context,
      role: state.role,
      namingCase: state.namingCase,
      requiredWords: state.requiredWords,
      isLoading: state.isLoading,
      error: state.error,
      setContext: state.setContext,
      setRole: state.setRole,
      setNamingCase: state.setNamingCase,
      addRequiredWord: state.addRequiredWord,
      removeRequiredWord: state.removeRequiredWord,
    }))
  );
  const generateNames = useGenerateNames();
  const t = useTranslation();

  const isSubmitDisabled = isLoading || !context.trim();

  const handleGenerate = () => {
    if (isSubmitDisabled) return;
    generateNames.mutate({ context, role, namingCase, requiredWords });
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
        <Select
          id="role"
          value={role}
          options={ROLE_OPTIONS.map((value) => ({ value, label: t.roles[value] }))}
          onChange={setRole}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="case">{t.form.caseLabel}</label>
        <Select
          id="case"
          value={namingCase}
          options={CASE_OPTIONS}
          onChange={setNamingCase}
        />
      </div>

      {/* Optional, so it comes after every required field */}
      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <label htmlFor="required-words">{t.form.requiredWordsLabel}</label>
          <span className={styles.hint}>{t.form.requiredWordsHint(MAX_REQUIRED_WORDS)}</span>
        </div>
        <ChipInput
          id="required-words"
          values={requiredWords}
          onAdd={addRequiredWord}
          onRemove={removeRequiredWord}
          maxCount={MAX_REQUIRED_WORDS}
          maxLength={MAX_REQUIRED_WORD_LENGTH}
          placeholder={t.form.requiredWordsPlaceholder}
          addLabel={t.form.requiredWordsAdd}
          removeLabel={t.form.requiredWordsRemove}
        />
      </div>

      <button
        className={styles.submitBtn}
        onClick={handleGenerate}
        disabled={isSubmitDisabled}
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
