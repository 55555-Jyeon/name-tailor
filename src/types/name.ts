// Optional conventions for the function role: where the verb goes, and a `use` prefix (hooks)
export type FunctionRule = 'verb-suffix' | 'verb-prefix' | 'use-prefix';

// What the user asks for: one description, its role and the naming convention
export interface NameRequest {
  context: string;
  role: string;
  namingCase: string;
  // Words every suggested name must contain (cards saved before this option have none)
  requiredWords?: string[];
  // Only sent when role is 'function'
  functionRules?: FunctionRule[];
}

// One word the name is built from, with a short meaning in each language
export interface NameWord {
  word: string;
  definition: string;
  definitionKo: string;
}

export interface NameSuggestion {
  name: string;
  // English explanation (cards saved before translation support only have this one)
  explanation: string;
  explanationKo?: string;
  // Cards saved before word definitions were added have no words
  words?: NameWord[];
}

// One card in the results panel: a single generation and the inputs that produced it
export interface GenerationResult extends NameRequest {
  id: string;
  suggestions: NameSuggestion[];
  createdAt: number;
}
