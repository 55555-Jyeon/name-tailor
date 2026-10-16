import type { FunctionRule } from '@/types/name';

// Widest scope first. Labels are translated (see locales); naming conventions read the same in every language
const ROLE_OPTIONS = ['project', 'file', 'component', 'function', 'class', 'constant', 'variable'];

// Roles from before the list was regrouped, mapped to where they live now (used when reusing old cards)
const LEGACY_ROLES: Record<string, { role: string; functionRules?: FunctionRule[] }> = {
  directory: { role: 'file' },
  hook: { role: 'function', functionRules: ['use-prefix'] },
};

// Extra checkboxes shown only for the function role
const FUNCTION_RULES: FunctionRule[] = ['verb-suffix', 'verb-prefix', 'use-prefix'];

// A verb cannot be both first and last, so these two never stay checked together
const VERB_POSITION_RULES: FunctionRule[] = ['verb-suffix', 'verb-prefix'];

const isFunctionRule = (value: unknown): value is FunctionRule =>
  FUNCTION_RULES.includes(value as FunctionRule);

// Keeps known rules only, once each, in FUNCTION_RULES order.
// If both verb positions are present, the later one in `values` wins: a checkbox toggle
// appends the new pick, so checking one verb position unchecks the other.
const sanitizeFunctionRules = (values: unknown[]): FunctionRule[] => {
  const known = values.filter(isFunctionRule);
  const verbPosition = known.filter((rule) => VERB_POSITION_RULES.includes(rule)).at(-1);
  return FUNCTION_RULES.filter(
    (rule) => known.includes(rule) && (!VERB_POSITION_RULES.includes(rule) || rule === verbPosition)
  );
};

// Labels are translated (see locales `cases`); the value itself is what the prompt receives
const CASE_OPTIONS = ['camelCase', 'PascalCase', 'snake_case', 'kebab-case', 'UPPER_SNAKE_CASE'];

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

export {
  ROLE_OPTIONS,
  LEGACY_ROLES,
  CASE_OPTIONS,
  FUNCTION_RULES,
  MAX_REQUIRED_WORDS,
  MAX_REQUIRED_WORD_LENGTH,
  sanitizeFunctionRules,
  sanitizeRequiredWords,
};
