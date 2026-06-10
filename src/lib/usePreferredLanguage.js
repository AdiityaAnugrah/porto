import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiUrl } from "./api";
import { getLocaleFromPath } from "./i18n";

export const detectLocalLanguage = () => {
  if (typeof window === "undefined") return "en";

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const hasIndonesianLocale = languages.some((language) =>
    String(language || "").toLowerCase().startsWith("id")
  );
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

  return hasIndonesianLocale || timeZone === "Asia/Jakarta" ? "id" : "en";
};

export const usePreferredLanguage = () => {
  const location = useLocation();
  const routeLocale = getLocaleFromPath(location.pathname);
  const [detectedLanguage, setDetectedLanguage] = useState(detectLocalLanguage);
  const language = routeLocale || detectedLanguage;

  useEffect(() => {
    if (routeLocale) return undefined;

    let active = true;

    fetch(apiUrl("/visitor/context"))
      .then((response) => {
        if (!response.ok) throw new Error("Visitor context unavailable");
        return response.json();
      })
      .then((data) => {
        if (!active || !data.countryCode) return;
        setDetectedLanguage(data.countryCode === "ID" ? "id" : "en");
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [routeLocale]);

  return useMemo(() => ({ language, isIndonesian: language === "id" }), [language]);
};
