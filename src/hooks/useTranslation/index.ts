import { DICTIONARIES } from '@/locales';
import { useSettings } from '@/providers/SettingsProvider';

// Returns the UI text for the current language
const useTranslation = () => {
  const { language } = useSettings();
  return DICTIONARIES[language];
};

export { useTranslation };
