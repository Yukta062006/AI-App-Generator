"use client";

import React, { createContext, useContext, useState } from "react";

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ 
  children, 
  translations, 
  defaultLanguage 
}: { 
  children: React.ReactNode; 
  translations: Record<string, any>;
  defaultLanguage: string;
}) {
  const [language, setLanguage] = useState(defaultLanguage);

  const t = (key: string) => {
    // Nested key support (e.g., "dashboard.welcome")
    const keys = key.split(".");
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Fallback to key
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
