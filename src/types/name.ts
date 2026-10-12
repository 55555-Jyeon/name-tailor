// What the user asks for: one description, its role and the naming convention
export interface NameRequest {
  context: string;
  role: string;
  namingCase: string;
}

export interface NameSuggestion {
  name: string;
  // English explanation (cards saved before translation support only have this one)
  explanation: string;
  explanationKo?: string;
}

// One card in the results panel: a single generation and the inputs that produced it
export interface GenerationResult extends NameRequest {
  id: string;
  suggestions: NameSuggestion[];
  createdAt: number;
}
