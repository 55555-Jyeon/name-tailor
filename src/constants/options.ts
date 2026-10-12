export const ROLE_OPTIONS = [
  { value: 'variable', label: 'Variable' },
  { value: 'function', label: 'Function' },
  { value: 'component', label: 'Component (React/Vue/etc)' },
  { value: 'class', label: 'Class' },
  { value: 'hook', label: 'React Hook' },
  { value: 'file', label: 'File Name' },
  { value: 'directory', label: 'Directory Name' },
];

export const CASE_OPTIONS = [
  { value: 'camelCase', label: 'camelCase (myVariable)' },
  { value: 'PascalCase', label: 'PascalCase (MyClass)' },
  { value: 'snake_case', label: 'snake_case (my_variable)' },
  { value: 'kebab-case', label: 'kebab-case (my-file-name)' },
  { value: 'UPPER_SNAKE_CASE', label: 'UPPER_SNAKE_CASE (MY_CONSTANT)' },
];

export const getRoleLabel = (value: string) =>
  ROLE_OPTIONS.find((option) => option.value === value)?.label ?? value;
