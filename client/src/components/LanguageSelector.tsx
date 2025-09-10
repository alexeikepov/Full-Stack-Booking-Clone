// src/components/LanguageSelector.tsx
import { useState } from "react";
import { useLanguageCurrencyStore } from "@/stores/languageCurrency";
import ReactCountryFlag from "react-country-flag";

interface LanguageSelectorProps {
  variant?: "header" | "footer";
}

export default function LanguageSelector({
  variant = "header",
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguageCurrencyStore();

  const suggestedLanguages = [
    { code: "he", name: "עברית", countryCode: "IL" },
    { code: "ar", name: "العربية", countryCode: "SA" },
  ];

  const allLanguages = [
    { code: "en", name: "English (UK)", countryCode: "GB" },
    { code: "en-US", name: "English (US)", countryCode: "US" },
    { code: "ru", name: "Русский", countryCode: "RU" },
    { code: "fr", name: "Français", countryCode: "FR" },
    { code: "de", name: "Deutsch", countryCode: "DE" },
    { code: "nl", name: "Nederlands", countryCode: "NL" },
    { code: "es", name: "Español", countryCode: "ES" },
    { code: "es-AR", name: "Español (AR)", countryCode: "AR" },
    { code: "es-MX", name: "Español (MX)", countryCode: "MX" },
    { code: "ca", name: "Català", countryCode: "ES" },
    { code: "it", name: "Italiano", countryCode: "IT" },
    { code: "pt", name: "Português (PT)", countryCode: "PT" },
    { code: "pt-BR", name: "Português (BR)", countryCode: "BR" },
    { code: "no", name: "Norsk", countryCode: "NO" },
    { code: "fi", name: "Suomi", countryCode: "FI" },
    { code: "sv", name: "Svenska", countryCode: "SE" },
    { code: "da", name: "Dansk", countryCode: "DK" },
    { code: "cs", name: "Čeština", countryCode: "CZ" },
    { code: "hu", name: "Magyar", countryCode: "HU" },
    { code: "ro", name: "Română", countryCode: "RO" },
    { code: "ja", name: "日本語", countryCode: "JP" },
    { code: "zh-CN", name: "简体中文", countryCode: "CN" },
    { code: "zh-TW", name: "繁體中文", countryCode: "TW" },
    { code: "pl", name: "Polski", countryCode: "PL" },
    { code: "el", name: "Ελληνικά", countryCode: "GR" },
    { code: "tr", name: "Türkçe", countryCode: "TR" },
    { code: "bg", name: "Български", countryCode: "BG" },
    { code: "ar", name: "العربية", countryCode: "SA" },
    { code: "ko", name: "한국어", countryCode: "KR" },
    { code: "he", name: "עברית", countryCode: "IL" },
    { code: "lv", name: "Latviski", countryCode: "LV" },
    { code: "uk", name: "Українська", countryCode: "UA" },
    { code: "hi", name: "हिन्दी", countryCode: "IN" },
    { code: "id", name: "Bahasa Indonesia", countryCode: "ID" },
    { code: "ms", name: "Bahasa Malaysia", countryCode: "MY" },
    { code: "th", name: "ภาษาไทย", countryCode: "TH" },
    { code: "et", name: "Eesti", countryCode: "EE" },
    { code: "hr", name: "Hrvatski", countryCode: "HR" },
    { code: "lt", name: "Lietuvių", countryCode: "LT" },
    { code: "sk", name: "Slovenčina", countryCode: "SK" },
    { code: "sr", name: "Srpski", countryCode: "RS" },
    { code: "sl", name: "Slovenščina", countryCode: "SI" },
    { code: "vi", name: "Tiếng Việt", countryCode: "VN" },
    { code: "fil", name: "Filipino", countryCode: "PH" },
    { code: "is", name: "Íslenska", countryCode: "IS" },
  ];

  const buttonClasses =
    variant === "header"
      ? "flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded transition-colors text-white/90"
      : "flex items-center gap-1 hover:bg-gray-200 px-2 py-1 rounded transition-colors text-gray-700";

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={buttonClasses}>
        <ReactCountryFlag
          countryCode={language.countryCode || "GB"}
          svg
          style={{
            width: "20px",
            height: "15px",
            borderRadius: "2px",
          }}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Select your language
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Suggested for you section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Suggested for you
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang);
                        setIsOpen(false);
                      }}
                      className="text-left p-3 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-3"
                    >
                      <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{
                          width: "24px",
                          height: "18px",
                          borderRadius: "2px",
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {lang.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* All languages section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  All languages
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {allLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang);
                          setIsOpen(false);
                        }}
                        className={`text-left p-3 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-3 ${
                          language.code === lang.code ? "bg-blue-50" : ""
                        }`}
                      >
                        <ReactCountryFlag
                          countryCode={lang.countryCode}
                          svg
                          style={{
                            width: "24px",
                            height: "18px",
                            borderRadius: "2px",
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {lang.name}
                          </div>
                        </div>
                        {language.code === lang.code && (
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
