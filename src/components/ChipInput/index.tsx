'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './style.module.scss';
import type { ChipInputProps } from './type';

// Text field that turns each entry into a removable chip (Enter or the add button)
const ChipInput = ({
  id,
  values,
  onAdd,
  onRemove,
  maxCount,
  maxLength,
  placeholder,
  addLabel,
  removeLabel,
}: ChipInputProps) => {
  const [draft, setDraft] = useState('');

  const isFull = values.length >= maxCount;
  const isDuplicate = values.some((value) => value.toLowerCase() === draft.trim().toLowerCase());
  const canAdd = !isFull && draft.trim() !== '' && !isDuplicate;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd(draft.trim());
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // While a Korean/Japanese IME is composing, Enter only confirms the syllable
    if (event.nativeEvent.isComposing) return;

    if (event.key === 'Enter') {
      // Never let this Enter reach the form's own Enter-to-generate
      event.preventDefault();
      handleAdd();
      return;
    }

    // Backspace on an empty field removes the last chip, like most tag inputs
    if (event.key === 'Backspace' && draft === '' && values.length > 0) {
      onRemove(values[values.length - 1]);
    }
  };

  return (
    <div className={styles.chipInput}>
      <div className={styles.field}>
        <input
          type="text"
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={isFull}
          autoComplete="off"
          aria-invalid={isDuplicate || undefined}
        />
        <button type="button" className={styles.addBtn} onClick={handleAdd} disabled={!canAdd}>
          {addLabel}
        </button>
      </div>

      {values.length > 0 && (
        <ul className={styles.chips}>
          {values.map((value) => (
            <li key={value} className={styles.chip}>
              <span className={styles.chipLabel}>{value}</span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemove(value)}
                aria-label={removeLabel(value)}
                title={removeLabel(value)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7l10 10M17 7L7 17" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChipInput;
