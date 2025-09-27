import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import he from "./locales/he.json";
import ar from "./locales/ar.json";
import de from "./locales/de.json";
import ru from "./locales/ru.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import nl from "./locales/nl.json";
import pl from "./locales/pl.json";
import ca from "./locales/ca.json";
import ro from "./locales/ro.json";
import hu from "./locales/hu.json";
import ja from "./locales/ja.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";
import ko from "./locales/ko.json";
import uk from "./locales/uk.json";
import hi from "./locales/hi.json";
import id from "./locales/id.json";
import ms from "./locales/ms.json";
import th from "./locales/th.json";
import et from "./locales/et.json";
import hr from "./locales/hr.json";
import lt from "./locales/lt.json";
import sk from "./locales/sk.json";
import sr from "./locales/sr.json";
import sl from "./locales/sl.json";
import vi from "./locales/vi.json";
import fil from "./locales/fil.json";
import is from "./locales/is.json";
import lv from "./locales/lv.json";
import no from "./locales/no.json";
import bg from "./locales/bg.json";
import fi from "./locales/fi.json";
import sv from "./locales/sv.json";
import da from "./locales/da.json";
import cs from "./locales/cs.json";
import el from "./locales/el.json";
import tr from "./locales/tr.json";
import ptBR from "./locales/pt-BR.json";
import esMX from "./locales/es-MX.json";
import esAR from "./locales/es-AR.json";

const stored =
  typeof window !== "undefined" ? localStorage.getItem("lang") : null;
const fallbackLng = stored || "en";

// Minimal resources; add real translations later
const resources: Record<string, { translation: any }> = {
  en: { translation: en as any },
  he: { translation: he as any },
  ar: { translation: ar as any },
  de: { translation: de as any },
  ru: { translation: ru as any },
  fr: { translation: fr as any },
  es: { translation: es as any },
  it: { translation: it as any },
  pt: { translation: pt as any },
  nl: { translation: nl as any },
  pl: { translation: pl as any },
  ca: { translation: ca as any },
  no: { translation: no as any },
  fi: { translation: fi as any },
  sv: { translation: sv as any },
  da: { translation: da as any },
  cs: { translation: cs as any },
  el: { translation: el as any },
  tr: { translation: tr as any },
  "pt-BR": { translation: ptBR as any },
  "es-MX": { translation: esMX as any },
  "es-AR": { translation: esAR as any },
  ro: { translation: ro as any },
  hu: { translation: hu as any },
  ja: { translation: ja as any },
  "zh-CN": { translation: zhCN as any },
  "zh-TW": { translation: zhTW as any },
  ko: { translation: ko as any },
  uk: { translation: uk as any },
  hi: { translation: hi as any },
  id: { translation: id as any },
  ms: { translation: ms as any },
  th: { translation: th as any },
  et: { translation: et as any },
  hr: { translation: hr as any },
  lt: { translation: lt as any },
  sk: { translation: sk as any },
  sr: { translation: sr as any },
  sl: { translation: sl as any },
  vi: { translation: vi as any },
  fil: { translation: fil as any },
  is: { translation: is as any },
  lv: { translation: lv as any },
  bg: { translation: bg as any },
  // Map the rest to English for now (so UI works) until real translations are added
  "en-US": { translation: en as any },
};

i18n.use(initReactI18next).init({
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
