import type { FunctionRule, GenerationResult } from '@/types/name';
import type { ErrorCode } from '@/locales/type';

export interface NameState {
  context: string;
  role: string;
  namingCase: string;
  requiredWords: string[];
  // Kept while another role is picked, so switching back restores the checks
  functionRules: FunctionRule[];
  results: GenerationResult[];
  isLoading: boolean;
  error: ErrorCode | null;
  setContext: (context: string) => void;
  setRole: (role: string) => void;
  setNamingCase: (namingCase: string) => void;
  setRequiredWords: (words: string[]) => void;
  addRequiredWord: (word: string) => void;
  removeRequiredWord: (word: string) => void;
  setFunctionRules: (rules: FunctionRule[]) => void;
  addResult: (result: Omit<GenerationResult, 'id' | 'createdAt'>) => void;
  removeResult: (id: string) => void;
  removeSuggestion: (resultId: string, name: string) => void;
  clearResults: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: ErrorCode | null) => void;
}
