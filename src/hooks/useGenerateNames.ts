import { useMutation } from '@tanstack/react-query';
import { useNameStore } from '@/store/useNameStore';

// Messages shown to the user, keyed by the status code /api/generate returns
const getErrorMessage = (status: number) => {
  if (status === 429) return "You've used up the free quota for now. Please try again later.";
  if (status === 503 || status === 504) return 'The AI service is busy right now. Please try again in a moment.';
  return 'Something went wrong while generating names. Please try again.';
};

export const useGenerateNames = () => {
  const { addResult, setIsLoading, setError } = useNameStore();

  return useMutation({
    mutationFn: async ({ context, role, namingCase }: { context: string, role: string, namingCase: string }) => {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context, role, namingCase }),
      });

      if (!response.ok) {
        throw new Error(getErrorMessage(response.status));
      }

      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (data, variables) => {
      addResult({ ...variables, suggestions: data.suggestions || [] });
    },
    onError: (error) => {
      console.error('Error generating names:', error);
      setError(error.message);
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });
};
