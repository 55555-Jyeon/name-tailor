import type { RefObject } from 'react';

export interface NameFormProps {
  // Lets the page focus the description input (e.g. after reusing a card)
  inputRef: RefObject<HTMLInputElement | null>;
}
