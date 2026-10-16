import type { FunctionRule } from '@/types/name';

// Tried in order. Flash-Lite is fast and has more free quota; Flash is the backup
// (each model has its own free tier quota, so a 429 on one does not affect the other)
export const MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

// Gemini returns 503 when the model is temporarily overloaded; these usually clear within seconds
export const RETRY_DELAYS_MS = [2000, 4000];

// An overloaded model can hang for minutes before failing, so cap each request
export const REQUEST_TIMEOUT_MS = 15000;

// Role values are short keys; the prompt spells out what each one covers.
// Unknown roles (e.g. from older clients) are sent as-is.
export const ROLE_DESCRIPTIONS: Record<string, string> = {
  project: 'project name (an organization or repository)',
  file: 'folder or file name',
  component: 'UI component',
  function: 'function (a utility function or a React hook)',
  class: 'class',
  constant: 'constant',
  variable: 'variable',
};

export const FUNCTION_RULE_INSTRUCTIONS: Record<FunctionRule, string> = {
  'verb-suffix':
    'Put the action at the END of the name, after the nouns, usually as an agent noun (e.g. profileFetcher, not fetchProfile).',
  'verb-prefix': 'Start the name with a verb, followed by the nouns (e.g. fetchProfile).',
  'use-prefix': 'Start every name with "use", like a React hook (e.g. useProfileFetcher).',
};

// Forces Gemini to answer with exactly this shape, so no markdown cleanup is needed.
// Explanations come in both languages so the language toggle needs no extra request.
export const SUGGESTIONS_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      explanationEn: { type: "string" },
      explanationKo: { type: "string" },
      words: {
        type: "array",
        items: {
          type: "object",
          properties: {
            word: { type: "string" },
            definitionEn: { type: "string" },
            definitionKo: { type: "string" },
          },
          required: ["word", "definitionEn", "definitionKo"],
        },
      },
    },
    required: ["name", "explanationEn", "explanationKo", "words"],
  },
  minItems: 3,
  maxItems: 3,
};
