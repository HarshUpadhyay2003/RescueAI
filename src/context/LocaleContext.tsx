import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initI18n, getLocale, setLocale as setI18nLocale, t, Locale } from '../i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dir: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    initI18n();
    setLocaleState(getLocale());
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setI18nLocale(newLocale);
    setLocaleState(newLocale);
  };

  const dir = ['ar', 'he'].includes(locale) ? 'rtl' : 'ltr';

  return (
    <LocaleContext.Provider value={{ locale, setLocale: changeLocale, t, dir }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};