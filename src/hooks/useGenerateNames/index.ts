import { useMutation } from '@tanstack/react-query';
import { ERROR_MESSAGES } from './constant';
import { useNameStore } from '@/store/useNameStore';
import type { NameRequest } from '@/types/name';

const getErrorMessage = (status: number) => {
  if (status === 429) return ERROR_MESSAGES.quotaExceeded;
  if (status === 503 || status === 504) return ERROR_MESSAGES.busy;
  return ERROR_MESSAGES.unknown;
};

const useGenerateNames = () => {
  const { addResult, setIsLoading, setError } = useNameStore();

  return useMutation({
    mutationFn: async ({ context, role, namingCase }: NameRequest) => {
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

export { useGenerateNames };
