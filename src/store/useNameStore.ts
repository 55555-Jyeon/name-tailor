import { create } from 'zustand';

interface NameSuggestion {
  name: string;
  explanation: string;
}

interface NameState {
  context: string;
  role: string;
  namingCase: string;
  suggestions: NameSuggestion[];
  isLoading: boolean;
  error: string | null;
  setContext: (context: string) => void;
  setRole: (role: string) => void;
  setNamingCase: (namingCase: string) => void;
  setSuggestions: (suggestions: NameSuggestion[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNameStore = create<NameState>((set) => ({
  context: '',
  role: 'function',
  namingCase: 'camelCase',
  suggestions: [],
  isLoading: false,
  error: null,
  setContext: (context) => set({ context }),
  setRole: (role) => set({ role }),
  setNamingCase: (namingCase) => set({ namingCase }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
