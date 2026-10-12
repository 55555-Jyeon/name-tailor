import type { GenerationResult } from '@/types/name';

export interface NameState {
  context: string;
  role: string;
  namingCase: string;
  results: GenerationResult[];
  isLoading: boolean;
  error: string | null;
  setContext: (context: string) => void;
  setRole: (role: string) => void;
  setNamingCase: (namingCase: string) => void;
  addResult: (result: Omit<GenerationResult, 'id' | 'createdAt'>) => void;
  removeResult: (id: string) => void;
  clearResults: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}
