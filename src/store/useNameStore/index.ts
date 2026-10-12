import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NameState } from './type';

const useNameStore = create<NameState>()(
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
      // Drops one name from a card; the card goes away once its last name is removed
      removeSuggestion: (resultId, name) =>
        set((state) => ({
          results: state.results
            .map((result) =>
              result.id === resultId
                ? { ...result, suggestions: result.suggestions.filter((item) => item.name !== name) }
                : result
            )
            .filter((result) => result.suggestions.length > 0),
        })),
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

export { useNameStore };
