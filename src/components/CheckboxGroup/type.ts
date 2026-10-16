export interface CheckboxOption<T extends string> {
  value: T;
  label: string;
  // Short sample shown next to the label, e.g. a name that follows the rule
  example?: string;
}

export interface CheckboxGroupProps<T extends string> {
  legend: string;
  options: CheckboxOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
}
