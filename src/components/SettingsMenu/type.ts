export interface SegmentOption<T> {
  value: T;
  label: string;
}

export interface SegmentProps<T> {
  label: string;
  options: SegmentOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}
