// src/components/SEO.jsx
import { useEffect, useMemo } from "react";

/* ========= Helpers ========= */

/** Base URL dari env atau origin (fallback) */
const SITE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_SITE_URL) ||
  (typeof window !== "undefined" ? window.location.origin : "");

/** Nama situs (opsional dari env) */
const SITE_NAME =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_SITE_NAME) ||
  "My Portfolio";
/** Pastikan absolute URL */
const toAbsUrl = (pathOrUrl = "") => {
  if (!pathOrUrl) return SITE_URL;
  try {
    // Sudah absolute
    // eslint-disable-next-line no-new
    new URL(pathOrUrl);
    return pathOrUrl;
  } catch {
    const base = String(SITE_URL || "").replace(/\/+$/, "");
    const rel = String(pathOrUrl || "").startsWith("/")
      ? pathOrUrl
      : `/${pathOrUrl || ""}`;
    return base + rel;
  }
};

/** Upsert meta by name/property/link/script dengan data-seo id */
const upsert = (selector, create, attrs) => {
  if (typeof document === "undefined") return null;
  const head = document.head || document.getElementsByTagName("head")[0];
  if (!head) return null;

  let el = head.querySelector(selector);
  if (!el) {
    el = create();
    head.appendChild(el);
  }
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (v === null || v === undefined || v === false) return;
    el.setAttribute(k, String(v));
  });
  // khusus script ld+json: textContent, bukan attribute
  if ("textContent" in attrs) {
    el.textContent = attrs.textContent;
  }
  return el;
};

const setMetaByName = (name, content, id) =>
  content
    ? upsert(`meta[name="${name}"][data-seo="${id}"]`, () => {
        const m = document.createElement("meta");
        m.setAttribute("name", name);
        return m;
      }, { content, "data-seo": id })
    : null;

const setMetaByProp = (prop, content, id) =>
  content
    ? upsert(`meta[property="${prop}"][data-seo="${id}"]`, () => {
        const m = document.createElement("meta");
        m.setAttribute("property", prop);
        return m;
      }, { content, "data-seo": id })
    : null;

const setCanonical = (href, id) =>
  href
    ? upsert(`link[rel="canonical"][data-seo="${id}"]`, () => {
        const l = document.createElement("link");
        l.setAttribute("rel", "canonical");
        return l;
      }, { href, "data-seo": id })
    : null;

const setJsonLd = (json, id) =>
  json
    ? upsert(
        `script[type="application/ld+json"][data-seo="${id}"]`,
        () => {
          const s = document.createElement("script");
          s.type = "application/ld+json";
          return s;
        },
        { "data-seo": id, textContent: JSON.stringify(json) }
      )
    : null;

/** Normalisasi robots (mis. boolean/array/string) */
const normalizeRobots = (robots) => {
  if (!robots) return "index,follow";
  if (robots === true) return "index,follow";
  if (robots === false) return "noindex,nofollow";
  if (Array.isArray(robots)) return robots.join(",");
  return String(robots);
};

/** Potong panjang aman (untuk meta) */
const clamp = (str, n) => {
  if (!str) return str;
  const s = String(str);
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
};

/* ========= Komponen ========= */

/**
 * SEO
 * Props:
 * - title, description
 * - path         (untuk canonical, ex: "/about")
 * - type         (og:type) "website" | "article" | "profile" | etc.
 * - image        (relative/absolute)
 * - imageAlt     (alt untuk og/twitter)
 * - robots       (string | string[] | boolean)
 * - jsonLd       (object schema.org)
 * - siteName     (override, default env/VITE_SITE_NAME)
 * - titleTemplate (override, default: `${title} – ${siteName}`)
 * - locale       (default: "id_ID")
 * - twitter      ({ site, creator })
 */
export default function SEO({
  title,
  description,
  path = "",
  type = "website",
  image = "/assets/og-default.jpg",
  imageAlt,
  robots = "index,follow",
  jsonLd,
  siteName = SITE_NAME,
  titleTemplate,
  locale = "id_ID",
  twitter,
}) {
  // Hindari re-render LD karena referensi object baru;
  // jika benar-benar dinamis, caller bisa memoize sebelum dikirim.
  const memoLd = useMemo(() => jsonLd, [JSON.stringify(jsonLd || {})]);

  useEffect(() => {
    if (typeof document === "undefined") return () => {};

    const id = "seo-managed"; // penanda untuk cleanup
    const prevTitle = document.title;

    // Title
    const fullTitle = title
      ? (titleTemplate
          ? titleTemplate.replace(/%s/g, String(title))
          : `${title} | ${siteName}`)
      : siteName;

    document.title = fullTitle;

    // Canonical / URL / Image absolute
    const canonical = toAbsUrl(path);
    const ogImage = toAbsUrl(image);

    // Robots
    const robotsNorm = normalizeRobots(robots);

    // ====== Meta by name ======
    setMetaByName("description", clamp(description, 300), id);
    setMetaByName("robots", robotsNorm, id);
    setMetaByName("twitter:card", "summary_large_image", id);
    setMetaByName("twitter:title", clamp(fullTitle, 70), id);
    setMetaByName("twitter:description", clamp(description, 200), id);
    setMetaByName("twitter:image", ogImage, id);
    setMetaByName("twitter:image:alt", imageAlt || title || siteName, id);
    if (twitter?.site) setMetaByName("twitter:site", twitter.site, id);
    if (twitter?.creator) setMetaByName("twitter:creator", twitter.creator, id);

    // ====== Canonical ======
    setCanonical(canonical, id);

    // ====== Open Graph ======
    setMetaByProp("og:type", type, id);
    setMetaByProp("og:title", clamp(fullTitle, 70), id);
    setMetaByProp("og:description", clamp(description, 200), id);
    setMetaByProp("og:url", canonical, id);
    setMetaByProp("og:site_name", siteName, id);
    setMetaByProp("og:locale", locale, id);
    setMetaByProp("og:image", ogImage, id);
    setMetaByProp("og:image:secure_url", ogImage, id);
    setMetaByProp("og:image:alt", imageAlt || title || siteName, id);
    setMetaByProp("og:image:width", "1200", id);
    setMetaByProp("og:image:height", "630", id);

    // (Opsional) theme-color sesuai CSS var; aman jika tidak ada
    try {
      const theme = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-bg")
        .trim();
      if (theme) setMetaByName("theme-color", theme, id);
    } catch {
      // ignore
    }

    // ====== JSON-LD ======
    setJsonLd(memoLd, id);

    // Cleanup saat unmount/route change
    return () => {
      document.title = prevTitle;
      const nodes = document.head?.querySelectorAll(`[data-seo="${id}"]`);
      nodes?.forEach((n) => n.parentNode?.removeChild(n));
    };
  }, [
    title,
    description,
    path,
    type,
    image,
    imageAlt,
    robots,
    siteName,
    titleTemplate,
    locale,
    twitter?.site,
    twitter?.creator,
    memoLd,
  ]);

  return null;
}
