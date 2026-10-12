import type { GenerationResult } from '@/store/useNameStore';

export interface ResultCardProps {
  result: GenerationResult;
  onClose: () => void;
  onReuse: () => void;
}
