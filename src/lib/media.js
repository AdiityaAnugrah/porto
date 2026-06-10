const R2_PUBLIC_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_R2_PUBLIC_URL) ||
  "";

const normalizedR2Base = String(R2_PUBLIC_URL).replace(/\/+$/, "");
const absoluteUrlPattern = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;
const specialUrlPattern = /^(?:data:|blob:)/i;

export const hasR2PublicUrl = Boolean(normalizedR2Base);

export const isExternalMediaUrl = (value) => {
  const url = String(value || "").trim();
  return absoluteUrlPattern.test(url) || specialUrlPattern.test(url);
};

export const r2Image = (key, fallback = "") => {
  const value = String(key || "").trim();
  if (!value) return fallback;
  if (isExternalMediaUrl(value) || value.startsWith("/") || value.startsWith("#")) return value;

  const normalizedKey = value
    .replace(/^r2:\/?\/?/i, "")
    .replace(/^\/+/, "");

  if (!normalizedR2Base) return fallback || `/${normalizedKey}`;

  return `${normalizedR2Base}/${normalizedKey}`;
};

export const imageUrl = (source, fallback = "") => {
  const value = String(source || "").trim();
  if (!value) return fallback;
  if (value.toLowerCase().startsWith("r2:")) {
    return r2Image(value.replace(/^r2:\/?\/?/i, ""), fallback);
  }
  if (isExternalMediaUrl(value) || value.startsWith("/") || value.startsWith("#")) return value;

  return r2Image(value, fallback);
};
