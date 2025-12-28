import en from './locales/en.json';
import es from './locales/es.json';
import hi from './locales/hi.json';

export type Locale = 'en' | 'es' | 'hi' | 'fr' | 'ar' | 'pt' | 'ja' | 'zh';

const RESOURCES: Record<string, any> = {
  en,
  es,
  hi,
  // Fallback other languages to English for this demo, 
  // or you would import their json files here.
  fr: en, ar: en, pt: en, ja: en, zh: en
};

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español (Spanish)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  // Keeping others for UI selection, but they will map to EN UI for now 
  // unless json files are added.
  { code: "fr", name: "Français (French)" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "pt", name: "Português (Portuguese)" },
  { code: "ja", name: "日本語 (Japanese)" },
  { code: "zh", name: "中文 (Chinese)" },
];

let currentLocale: Locale = 'en';

export const initI18n = (defaultLocale: Locale = 'en') => {
  const saved = localStorage.getItem('rescueai_locale') as Locale;
  if (saved && RESOURCES[saved]) {
    currentLocale = saved;
  } else {
    const navLang = navigator.language.split('-')[0] as Locale;
    if (RESOURCES[navLang]) {
      currentLocale = navLang;
    } else {
      currentLocale = defaultLocale;
    }
  }
  updateDocumentDir(currentLocale);
};

export const getLocale = (): Locale => currentLocale;

export const setLocale = (locale: Locale) => {
  if (RESOURCES[locale] || SUPPORTED_LANGUAGES.find(l => l.code === locale)) {
    currentLocale = locale;
    localStorage.setItem('rescueai_locale', locale);
    updateDocumentDir(locale);
    // Force reload/re-render is handled by Context, this just updates state
  }
};

const updateDocumentDir = (locale: string) => {
  const isRtl = ['ar', 'he', 'fa'].includes(locale);
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = locale;
};

export const t = (key: string, params?: Record<string, string>): string => {
  const keys = key.split('.');
  
  // 1. Try current locale
  let value = keys.reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : null, RESOURCES[currentLocale]);
  
  // 2. Fallback to English if missing
  if (!value) {
    value = keys.reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : null, RESOURCES['en']);
  }
  
  // 3. Return key if absolutely missing
  if (typeof value !== 'string') return key;

  // Interpolate params
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(`{{${k}}}`, v);
    });
  }

  return value;
};

// Simple helper for rendering numbers based on locale
export const formatNumber = (num: number) => {
  return new Intl.NumberFormat(currentLocale).format(num);
};