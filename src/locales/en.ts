import type { Dictionary } from './type';

const en: Dictionary = {
  subtitle: 'AI-powered naming assistant for developers',
  form: {
    contextLabel: 'What does it do?',
    contextPlaceholder: 'e.g., Fetches user profile data from the server',
    roleLabel: 'What is this for?',
    caseLabel: 'Naming Convention',
    requiredWordsLabel: 'Must-include words (optional)',
    requiredWordsHint: (max) => `Up to ${max}`,
    functionRulesLabel: 'Extra rules',
    requiredWordsPlaceholder: 'e.g. user, draft',
    requiredWordsAdd: 'Add',
    requiredWordsRemove: (word) => `Remove ${word}`,
    generate: 'Generate Names ✨',
    generating: 'Generating...',
  },
  roles: {
    project: 'Project (organization / repository)',
    file: 'Folder / File',
    component: 'Component',
    function: 'Function (util / hook)',
    class: 'Class',
    constant: 'Constant',
    variable: 'Variable',
    // No longer in the list; kept so cards saved earlier still show a label
    hook: 'React Hook',
    directory: 'Directory Name',
  },
  functionRules: {
    'verb-suffix': { label: 'Put the verb at the end.', example: 'profileFetcher', short: 'verb last' },
    'verb-prefix': { label: 'Put the verb first.', example: 'fetchProfile', short: 'verb first' },
    'use-prefix': { label: 'Use the "use" prefix.', example: 'useProfileFetcher', short: 'use prefix' },
  },
  results: {
    count: (count) => `${count} ${count === 1 ? 'result' : 'results'}`,
    clearAll: 'Clear all',
    clearConfirm: 'Remove all generated names?',
    clearConfirmDescription: "Removed names can't be brought back.",
    clearConfirmAction: 'Remove all',
    cancel: 'Cancel',
    loading: 'Crafting the perfect names...',
    empty: 'Generated names will stack up here.',
  },
  card: {
    reuse: '↺ Reuse',
    reuseTitle: 'Fill the form with these inputs',
    close: 'Close',
    copy: 'Copy',
    copied: 'Copied ✓',
    copyLabel: (name) => `Copy ${name}`,
    removeLabel: (name) => `Remove ${name}`,
    removeTitle: 'Remove this name',
    words: 'Word meanings',
    requiredWords: 'Must-include words',
  },
  errors: {
    quotaExceeded: "You've used up the free quota for now. Please try again later.",
    busy: 'The AI service is busy right now. Please try again in a moment.',
    unknown: 'Something went wrong while generating names. Please try again.',
  },
  settings: {
    open: 'Settings',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    language: 'Language',
    browserLanguage: 'Browser',
  },
};

export default en;
