export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  // Also called for Escape and a click on the backdrop
  onCancel: () => void;
}
