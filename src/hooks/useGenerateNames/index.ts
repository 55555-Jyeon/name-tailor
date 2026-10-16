import { useMutation } from '@tanstack/react-query';
import { getErrorCode, toErrorCode } from './constant';
import { useNameStore } from '@/store/useNameStore';
import type { NameRequest } from '@/types/name';

const useGenerateNames = () => {
  // Actions never change, so selecting them one by one never triggers a re-render
  const addResult = useNameStore((state) => state.addResult);
  const setIsLoading = useNameStore((state) => state.setIsLoading);
  const setError = useNameStore((state) => state.setError);

  return useMutation({
    mutationFn: async ({ context, role, namingCase, requiredWords }: NameRequest) => {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context, role, namingCase, requiredWords }),
      });

      if (!response.ok) {
        throw new Error(getErrorCode(response.status));
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
      // Server errors carry an error code; anything else (e.g. the network is down) is 'unknown'
      setError(toErrorCode(error));
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });
};

export { useGenerateNames };
