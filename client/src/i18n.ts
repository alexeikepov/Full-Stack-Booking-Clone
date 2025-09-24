import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import he from "./locales/he.json";

const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
const fallbackLng = stored || "en";

// Minimal resources; add real translations later
const resources = {
  en: { translation: en as any },
  he: { translation: he as any },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: fallbackLng,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    returnNull: false,
  });

// Set document direction for RTL languages
if (typeof document !== "undefined") {
  const isRtl = ["he", "ar"].some((l) => fallbackLng.startsWith(l));
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  document.documentElement.lang = fallbackLng;
}

export default i18n;


