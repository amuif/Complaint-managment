'use client';

import type React from 'react';
import { createContext, useContext, useState } from 'react';
import enTranslations from '@/data/translations/en.json';
import amTranslations from '@/data/translations/am.json';
import afTranslations from '@/data/translations/af.json';

type Language = 'en' | 'am' | 'af';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoaded: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: enTranslations,
  am: amTranslations,
  af: afTranslations,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Function to get translation with interpolation
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language]?.[key as keyof (typeof translations)[typeof language]];

    if (!translation) {
      // Fallback to English if key not found in current language
      translation = translations['en']?.[key as keyof (typeof translations)['en']] || key;
    }

    if (params && translation) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value));
        translation = translation.replace(`{${param}}`, String(value));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoaded: true }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
