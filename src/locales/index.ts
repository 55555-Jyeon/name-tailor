import en from './en';
import ko from './ko';
import type { Dictionary, Language } from './type';

const DICTIONARIES: Record<Language, Dictionary> = { ko, en };

// Shown in each language's own name so it is recognizable whatever the UI language is
const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
];

const isLanguage = (value: string | undefined): value is Language => value === 'ko' || value === 'en';

// First visit: Korean browsers get Korean, everyone else gets English
const detectLanguage = (acceptLanguage: string | null): Language => {
  const preferred = acceptLanguage?.split(',')[0]?.trim().toLowerCase() ?? '';
  return preferred.startsWith('ko') ? 'ko' : 'en';
};

export { DICTIONARIES, LANGUAGES, isLanguage, detectLanguage };
