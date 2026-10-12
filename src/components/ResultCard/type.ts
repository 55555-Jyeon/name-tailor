import type { GenerationResult } from '@/types/name';

export interface ResultCardProps {
  result: GenerationResult;
  onClose: () => void;
  onReuse: () => void;
}
