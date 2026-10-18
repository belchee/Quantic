import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import mk from './locales/mk.json';
import sq from './locales/sq.json';
import type { AppLanguage } from '@/types/database';

export const LANGUAGES: { code: AppLanguage; label: string }[] = [
  { code: 'sq', label: 'Shqip' },
  { code: 'mk', label: 'Македонски' },
  { code: 'en', label: 'English' },
];

export const DEFAULT_LANGUAGE: AppLanguage = 'sq';

export function isLanguage(v: unknown): v is AppLanguage {
  return v === 'sq' || v === 'mk' || v === 'en';
}

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources: { sq: { translation: sq }, mk: { translation: mk }, en: { translation: en } },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof en };
  }
}
