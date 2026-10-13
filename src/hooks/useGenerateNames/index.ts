import { useMutation } from '@tanstack/react-query';
import { getErrorCode, toErrorCode } from './constant';
import { useNameStore } from '@/store/useNameStore';
import type { NameRequest } from '@/types/name';

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
