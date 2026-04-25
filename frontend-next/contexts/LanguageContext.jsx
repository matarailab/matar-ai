'use client';

import { createContext, useContext, useState } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('it');
  const t = translations[lang];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback se il provider non è montato
    return { lang: 'it', setLang: () => {}, t: translations.it };
  }
  return ctx;
};
