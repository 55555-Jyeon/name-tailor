import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NameSuggestion {
  name: string;
  explanation: string;
}

// One card in the results panel: a single generation and the inputs that produced it
export interface GenerationResult {
  id: string;
  context: string;
  role: string;
  namingCase: string;
  suggestions: NameSuggestion[];
  createdAt: number;
}

interface NameState {
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

export const useNameStore = create<NameState>()(
  persist(
    (set) => ({
      context: '',
      role: 'function',
      namingCase: 'camelCase',
      results: [],
      isLoading: false,
      error: null,
      setContext: (context) => set({ context }),
      setRole: (role) => set({ role }),
      setNamingCase: (namingCase) => set({ namingCase }),
      // Newest first, so the latest result is always visible without scrolling
      addResult: (result) =>
        set((state) => ({
          results: [{ ...result, id: crypto.randomUUID(), createdAt: Date.now() }, ...state.results],
        })),
      removeResult: (id) =>
        set((state) => ({ results: state.results.filter((result) => result.id !== id) })),
      clearResults: () => set({ results: [] }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'name-tailor-results',
      // Only the result cards survive a reload
      partialize: (state) => ({ results: state.results }),
      // Rehydrated from the page after mount, so the server and first client render match
      skipHydration: true,
    }
  )
);
