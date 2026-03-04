import { useMutation } from '@tanstack/react-query';
import { useNameStore } from '@/store/useNameStore';

export const useGenerateNames = () => {
  const { setSuggestions, setIsLoading } = useNameStore();

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
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
      setSuggestions([]);
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions || []);
    },
    onError: (error) => {
      console.error('Error generating names:', error);
      // In a real app we might show a toast here. For now, empty results.
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });
};
