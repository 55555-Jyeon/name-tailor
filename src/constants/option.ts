// Role labels are translated (see locales); naming conventions read the same in every language
const ROLE_OPTIONS = ['variable', 'function', 'component', 'class', 'hook', 'file', 'directory', 'project'];

const CASE_OPTIONS = [
  { value: 'camelCase', label: 'camelCase (myVariable)' },
  { value: 'PascalCase', label: 'PascalCase (MyClass)' },
  { value: 'snake_case', label: 'snake_case (my_variable)' },
  { value: 'kebab-case', label: 'kebab-case (my-file-name)' },
  { value: 'UPPER_SNAKE_CASE', label: 'UPPER_SNAKE_CASE (MY_CONSTANT)' },
];

// Shared by the form and the API: more words than this rarely fit in one good name
const MAX_REQUIRED_WORDS = 5;

const MAX_REQUIRED_WORD_LENGTH = 30;

// Trims, drops empty or too-long words and case-insensitive duplicates, and caps the count
const sanitizeRequiredWords = (words: unknown[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const word of words) {
    if (typeof word !== 'string') continue;
    const trimmed = word.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || trimmed.length > MAX_REQUIRED_WORD_LENGTH || seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
    if (result.length === MAX_REQUIRED_WORDS) break;
  }
  return result;
};

export { ROLE_OPTIONS, CASE_OPTIONS, MAX_REQUIRED_WORDS, MAX_REQUIRED_WORD_LENGTH, sanitizeRequiredWords };
