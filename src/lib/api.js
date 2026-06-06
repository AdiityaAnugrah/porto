const DEFAULT_API_BASE_URL = "https://api.adityaanugrah.me";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  DEFAULT_API_BASE_URL;

export const apiUrl = (path) => {
  const base = String(API_BASE_URL).replace(/\/+$/, "");
  const normalizedPath = String(path || "").startsWith("/") ? path : `/${path || ""}`;

  return `${base}${normalizedPath}`;
};
