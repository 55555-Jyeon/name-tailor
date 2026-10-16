// Role labels are translated (see locales); naming conventions read the same in every language
const ROLE_OPTIONS = ['variable', 'function', 'component', 'class', 'hook', 'file', 'directory', 'project'];

const CASE_OPTIONS = [
  { value: 'camelCase', label: 'camelCase (myVariable)' },
  { value: 'PascalCase', label: 'PascalCase (MyClass)' },
  { value: 'snake_case', label: 'snake_case (my_variable)' },
  { value: 'kebab-case', label: 'kebab-case (my-file-name)' },
  { value: 'UPPER_SNAKE_CASE', label: 'UPPER_SNAKE_CASE (MY_CONSTANT)' },
];

export { ROLE_OPTIONS, CASE_OPTIONS };
