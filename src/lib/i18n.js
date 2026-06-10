import { useCallback } from "react";
import { useLocation } from "react-router-dom";

export const SUPPORTED_LOCALES = ["id", "en"];
export const DEFAULT_LOCALE = "en";
export const INDONESIAN_LOCALE = "id";

export const isSupportedLocale = (locale) => SUPPORTED_LOCALES.includes(String(locale || "").toLowerCase());

export const getLocaleFromPath = (pathname = "") => {
  const firstSegment = String(pathname || "").split("/").filter(Boolean)[0];
  return isSupportedLocale(firstSegment) ? firstSegment.toLowerCase() : null;
};

export const stripLocaleFromPath = (pathname = "") => {
  const parts = String(pathname || "/").split("/");
  const firstSegment = parts.filter(Boolean)[0];

  if (!isSupportedLocale(firstSegment)) return pathname || "/";

  const stripped = `/${parts.filter(Boolean).slice(1).join("/")}`;
  return stripped === "/" ? "/" : stripped.replace(/\/+$/, "");
};

export const localizedPath = (path = "/", locale = DEFAULT_LOCALE) => {
  const activeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const value = String(path || "/");

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return value;
  }

  if (value.startsWith("#")) return `/${activeLocale}${value}`;

  const [pathWithQuery, hash = ""] = value.split("#");
  const [rawPath, query = ""] = pathWithQuery.split("?");
  const unlocalizedPath = stripLocaleFromPath(rawPath || "/");
  const normalizedPath = unlocalizedPath === "/" ? "" : unlocalizedPath;
  const queryString = query ? `?${query}` : "";
  const hashString = hash ? `#${hash}` : "";

  return `/${activeLocale}${normalizedPath}${queryString}${hashString}`;
};

export const localeToOgLocale = (locale) => (locale === "id" ? "id_ID" : "en_US");

export const useActiveLocale = () => {
  const location = useLocation();
  return getLocaleFromPath(location.pathname) || DEFAULT_LOCALE;
};

export const useLocalizedPath = () => {
  const locale = useActiveLocale();
  return useCallback((path) => localizedPath(path, locale), [locale]);
};
