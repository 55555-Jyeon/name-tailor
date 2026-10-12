import type { GenerationResult } from '@/store/useNameStore';

export interface ResultPanelProps {
  onReuse: (result: GenerationResult) => void;
}
