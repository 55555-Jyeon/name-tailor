export interface ChipInputProps {
  // Put on the text input, so <label htmlFor={id}> names it
  id: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  maxCount: number;
  maxLength: number;
  placeholder: string;
  addLabel: string;
  removeLabel: (value: string) => string;
}
