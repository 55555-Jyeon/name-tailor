import en from './en';
import ko from './ko';
import type { Dictionary, Language } from './type';

const DICTIONARIES: Record<Language, Dictionary> = { ko, en };

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'ko', label: 'KO' },
  { value: 'en', label: 'EN' },
];

const isLanguage = (value: string | undefined): value is Language => value === 'ko' || value === 'en';

// First visit: Korean browsers get Korean, everyone else gets English
const detectLanguage = (acceptLanguage: string | null): Language => {
  const preferred = acceptLanguage?.split(',')[0]?.trim().toLowerCase() ?? '';
  return preferred.startsWith('ko') ? 'ko' : 'en';
};

export { DICTIONARIES, LANGUAGES, isLanguage, detectLanguage };
