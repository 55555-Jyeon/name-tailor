// What the user asks for: one description, its role and the naming convention
export interface NameRequest {
  context: string;
  role: string;
  namingCase: string;
}

export interface NameSuggestion {
  name: string;
  explanation: string;
}

// One card in the results panel: a single generation and the inputs that produced it
export interface GenerationResult extends NameRequest {
  id: string;
  suggestions: NameSuggestion[];
  createdAt: number;
}
