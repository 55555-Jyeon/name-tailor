'use client';

import { useEffect, useId, useRef } from 'react';
import styles from './style.module.scss';
import type { ConfirmModalProps } from './type';

// Built on <dialog>: showModal() puts it in the top layer, traps focus and blocks the page behind it
const ConfirmModal = ({ isOpen, title, description, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Escape: let the parent close it so isOpen stays the single source of truth
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      // The panel fills the dialog, so a click that lands on the dialog itself hit the backdrop
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={styles.panel}>
        <h2 id={titleId} className={styles.title}>{title}</h2>
        {description && (
          <p id={descriptionId} className={styles.description}>{description}</p>
        )}
        <div className={styles.actions}>
          {/* Focused first, so a stray Enter does not delete anything */}
          <button type="button" className={styles.cancelBtn} onClick={onCancel} autoFocus>
            {cancelLabel}
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmModal;
