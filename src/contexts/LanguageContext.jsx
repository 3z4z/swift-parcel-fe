import { createContext, useContext } from "react";
import i18n from "../i18n";

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  return useContext(LanguageContext);
}
