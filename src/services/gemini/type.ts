import type { GoogleGenAI } from '@google/genai';

export type GenerateParams = Parameters<GoogleGenAI['models']['generateContent']>[0];

// One item of the JSON Gemini returns (see SUGGESTIONS_SCHEMA)
export interface GeminiSuggestion {
  name: string;
  explanationEn: string;
  explanationKo: string;
}
