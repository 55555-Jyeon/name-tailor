import type { GenerationResult } from '@/types/name';

export interface ResultPanelProps {
  onReuse: (result: GenerationResult) => void;
}
