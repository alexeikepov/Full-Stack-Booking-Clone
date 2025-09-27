// src/stores/languageCurrency.ts
import { create } from "zustand";

interface LanguageCurrencyState {
  language: {
    code: string;
    name: string;
    countryCode: string;
  };
  currency: {
    code: string;
    name: string;
  };
  setLanguage: (language: {
    code: string;
    name: string;
    countryCode: string;
  }) => void;
  setCurrency: (currency: { code: string; name: string }) => void;
}

export const useLanguageCurrencyStore = create<LanguageCurrencyState>(
  (set) => ({
    language: {
      code: "en",
      name: "English (UK)",
      countryCode: "GB",
    },
    currency: {
      code: "ILS",
      name: "Israeli Shekel",
    },
    setLanguage: (language) => set({ language }),
    setCurrency: (currency) => set({ currency }),
  })
);
