export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  // Put on the trigger button, so <label htmlFor={id}> names it like a native select
  id: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}
