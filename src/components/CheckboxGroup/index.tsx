'use client';

import styles from './style.module.scss';
import type { CheckboxGroupProps } from './type';

// Multi-select as checkboxes: a real <input type="checkbox"> under a custom box, so keyboard and screen readers work as usual
const CheckboxGroup = <T extends string>({ legend, options, values, onChange }: CheckboxGroupProps<T>) => {
  const toggle = (value: T) => {
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            type="checkbox"
            className={styles.input}
            checked={values.includes(option.value)}
            onChange={() => toggle(option.value)}
          />
          <span className={styles.box} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <span className={styles.label}>{option.label}</span>
          {option.example && <code className={styles.example}>{option.example}</code>}
        </label>
      ))}
    </fieldset>
  );
};

export default CheckboxGroup;
