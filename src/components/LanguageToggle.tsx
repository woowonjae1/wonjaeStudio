"use client";

import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { Locale, getStoredLocale, setStoredLocale } from "@/lib/i18n";

interface LanguageToggleProps {
  onLocaleChange?: (locale: Locale) => void;
}

export function LanguageToggle({ onLocaleChange }: LanguageToggleProps) {
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === "zh" ? "en" : "zh";
    setLocale(newLocale);
    setStoredLocale(newLocale);
    onLocaleChange?.(newLocale);
    window.dispatchEvent(
      new CustomEvent("localeChange", { detail: newLocale })
    );
  };

  if (!mounted) {
    return (
      <button className="lang-toggle" aria-label="Toggle language">
        <Globe className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      className="lang-toggle"
      onClick={toggleLocale}
      aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}
      title={locale === "zh" ? "English" : "中文"}
    >
      <span className="lang-text">{locale === "zh" ? "EN" : "中"}</span>
    </button>
  );
}
