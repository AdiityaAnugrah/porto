import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "./api";

const detectLocalLanguage = () => {
  if (typeof window === "undefined") return "en";

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const hasIndonesianLocale = languages.some((language) =>
    String(language || "").toLowerCase().startsWith("id")
  );
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

  return hasIndonesianLocale || timeZone === "Asia/Jakarta" ? "id" : "en";
};

export const usePreferredLanguage = () => {
  const [language, setLanguage] = useState(detectLocalLanguage);

  useEffect(() => {
    let active = true;

    fetch(apiUrl("/visitor/context"))
      .then((response) => {
        if (!response.ok) throw new Error("Visitor context unavailable");
        return response.json();
      })
      .then((data) => {
        if (!active || !data.countryCode) return;
        setLanguage(data.countryCode === "ID" ? "id" : "en");
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => ({ language, isIndonesian: language === "id" }), [language]);
};
