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
  setContext: (context: string) => void;
  setRole: (role: string) => void;
  setNamingCase: (namingCase: string) => void;
  setSuggestions: (suggestions: NameSuggestion[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useNameStore = create<NameState>((set) => ({
  context: '',
  role: 'function',
  namingCase: 'camelCase',
  suggestions: [],
  isLoading: false,
  setContext: (context) => set({ context }),
  setRole: (role) => set({ role }),
  setNamingCase: (namingCase) => set({ namingCase }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
