import { useMutation } from '@tanstack/react-query';
import { getErrorCode } from './constant';
import { useNameStore } from '@/store/useNameStore';
import type { NameRequest } from '@/types/name';
import type { ErrorCode } from '@/locales/type';

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
      // The message is an error code; the form shows it in the current language
      setError(error.message as ErrorCode);
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });
};

export { useGenerateNames };
