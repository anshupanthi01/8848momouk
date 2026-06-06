import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import enCommon from "./locales/en/common.json"
import enNavbar from "./locales/en/navbar.json"
import enHome from "./locales/en/home.json"
import enFooter from "./locales/en/footer.json"
import enAbout from "./locales/en/about.json"
import enFranchise from "./locales/en/franchise.json"
import enMenu from "./locales/en/menu.json"
import enGallery from "./locales/en/gallery.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        navbar: enNavbar,
        home: enHome,
        footer: enFooter,
        about: enAbout,
        franchise: enFranchise,
        menu: enMenu,
        gallery: enGallery,
      },
    },
    fallbackLng: "en",
    supportedLngs: ["en"],
    ns: ["common", "navbar", "home", "footer", "about", "franchise", "menu", "gallery"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },
  })

export default i18n
