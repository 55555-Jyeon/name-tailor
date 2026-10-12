import type { GenerationResult } from '@/types/name';

export interface ResultCardProps {
  result: GenerationResult;
  onClose: () => void;
  onRemoveSuggestion: (name: string) => void;
  onReuse: () => void;
}
