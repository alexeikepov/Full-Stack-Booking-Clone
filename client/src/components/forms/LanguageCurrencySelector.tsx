// src/components/LanguageCurrencySelector.tsx
import { useState } from "react";
import { useLanguageCurrencyStore } from "@/stores/languageCurrency";

export default function LanguageCurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, currency, setCurrency } = useLanguageCurrencyStore();

  const suggestedCurrencies = [
    { code: "EUR", name: "Euro" },
    { code: "USD", name: "United States Dollar" },
    { code: "GBP", name: "Pound Sterling" },
    { code: "INR", name: "Indian Rupee" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "AUD", name: "Australian Dollar" },
  ];

  const allCurrencies = [
    { code: "ILS", name: "Israeli New Shekel" },
    { code: "PROP", name: "Property currency (€$£)" },
    { code: "ARS", name: "Argentine Peso" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "AZN", name: "Azerbaijani Manat" },
    { code: "BHD", name: "Bahraini Dinar" },
    { code: "BRL", name: "Brazilian Real" },
    { code: "BGN", name: "Bulgarian Lev" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "CLP", name: "Chilean Peso" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "COP", name: "Colombian Peso" },
    { code: "CZK", name: "Czech Koruna" },
    { code: "DKK", name: "Danish Krone" },
    { code: "EGP", name: "Egyptian Pound" },
    { code: "EUR", name: "Euro" },
    { code: "FJD", name: "Fijian Dollar" },
    { code: "GEL", name: "Georgian Lari" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "HUF", name: "Hungarian Forint" },
    { code: "ISK", name: "Icelandic Króna" },
    { code: "INR", name: "Indian Rupee" },
    { code: "IDR", name: "Indonesian Rupiah" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "JOD", name: "Jordanian Dinar" },
    { code: "KZT", name: "Kazakhstani Tenge" },
    { code: "KWD", name: "Kuwaiti Dinar" },
    { code: "MOP", name: "Macanese Pataca" },
    { code: "MYR", name: "Malaysian Ringgit" },
    { code: "MXN", name: "Mexican Peso" },
    { code: "MDL", name: "Moldovan Leu" },
    { code: "NAD", name: "Namibian Dollar" },
    { code: "TWD", name: "New Taiwan Dollar" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "NOK", name: "Norwegian Krone" },
    { code: "OMR", name: "Omani Rial" },
    { code: "PLN", name: "Polish Złoty" },
    { code: "GBP", name: "Pound Sterling" },
    { code: "QAR", name: "Qatari Riyal" },
    { code: "RON", name: "Romanian Leu" },
    { code: "RUB", name: "Russian Rouble" },
    { code: "SAR", name: "Saudi Arabian Riyal" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "ZAR", name: "South African Rand" },
    { code: "KRW", name: "South Korean Won" },
    { code: "SEK", name: "Swedish Krona" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "THB", name: "Thai Baht" },
    { code: "TRY", name: "Turkish Lira" },
    { code: "UAH", name: "Ukrainian Hryvnia" },
    { code: "AED", name: "United Arab Emirates Dirham" },
    { code: "USD", name: "United States Dollar" },
    { code: "XOF", name: "West African CFA Franc" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 hover:bg-gray-200 px-2 py-1 rounded transition-colors text-gray-700 border border-transparent hover:border-gray-300"
      >
        <span className="text-sm font-bold">{currency.code}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Select your currency
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
              <p className="text-sm text-gray-600 mb-6">
                Where applicable prices will be converted to, and shown in, the
                currency that you select. The currency you pay in may differ
                based on your reservation, and a service fee may also apply.
              </p>

              {/* Currencies in 4 columns with scroll */}
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-4 gap-2">
                  {allCurrencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency({ code: curr.code, name: curr.name });
                        setIsOpen(false);
                      }}
                      className={`text-left p-3 hover:bg-gray-50 rounded-md transition-colors ${
                        currency.code === curr.code ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="font-medium text-gray-900 text-sm">
                        {curr.name}
                      </div>
                      <div className="text-xs text-gray-500">{curr.code}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
