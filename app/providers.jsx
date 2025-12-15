"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { getDictionary } from "@/lib/i18n";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  // Default language: English
  const [lang, setLang] = useState("en");

  const value = useMemo(() => {
    const t = getDictionary(lang);
    return { lang, setLang, t };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider />");
  return ctx;
}