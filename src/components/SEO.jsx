import { useEffect } from "react";

/** Helper: base URL dari env atau origin */
const SITE_URL =
  import.meta?.env?.VITE_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

/** Pastikan absolute URL */
const toAbsUrl = (pathOrUrl = "") => {
  if (!pathOrUrl) return SITE_URL;
  try {
    new URL(pathOrUrl); // sudah absolute
    return pathOrUrl;
  } catch {
    const base = SITE_URL.replace(/\/+$/, "");
    const rel = String(pathOrUrl).startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return base + rel;
  }
};

/** Upsert <meta name="..."> */
const upsertMetaByName = (name, content, id) => {
  if (!content) return null;
  let el =
    document.head.querySelector(`meta[name="${name}"][data-seo="${id}"]`) ||
    document.createElement("meta");
  el.setAttribute("name", name);
  el.setAttribute("content", String(content));
  el.setAttribute("data-seo", id);
  if (!el.parentNode) document.head.appendChild(el);
  return el;
};

/** Upsert <meta property="..."> */
const upsertMetaByProp = (prop, content, id) => {
  if (!content) return null;
  let el =
    document.head.querySelector(
      `meta[property="${prop}"][data-seo="${id}"]`
    ) || document.createElement("meta");
  el.setAttribute("property", prop);
  el.setAttribute("content", String(content));
  el.setAttribute("data-seo", id);
  if (!el.parentNode) document.head.appendChild(el);
  return el;
};

/** Upsert <link rel="canonical"> */
const upsertCanonical = (href, id) => {
  if (!href) return null;
  let el =
    document.head.querySelector(`link[rel="canonical"][data-seo="${id}"]`) ||
    document.createElement("link");
  el.setAttribute("rel", "canonical");
  el.setAttribute("href", href);
  el.setAttribute("data-seo", id);
  if (!el.parentNode) document.head.appendChild(el);
  return el;
};

/** Upsert JSON-LD */
const upsertJsonLd = (json, id) => {
  if (!json) return null;
  let el =
    document.head.querySelector(`script[type="application/ld+json"][data-seo="${id}"]`) ||
    document.createElement("script");
  el.type = "application/ld+json";
  el.textContent = JSON.stringify(json);
  el.setAttribute("data-seo", id);
  if (!el.parentNode) document.head.appendChild(el);
  return el;
};

/**
 * SEO props:
 * - title, description
 * - path        (untuk canonical; contoh "/about")
 * - type        (og:type)  "website" | "article" | "profile"
 * - image       (relative/absolute)
 * - robots      (default "index,follow")
 * - jsonLd      (object schema.org)
 */
export default function SEO({
  title,
  description,
  path = "",
  type = "website",
  image = "/assets/og-default.jpg",
  robots = "index,follow",
  jsonLd
}) {
  useEffect(() => {
    const id = "seo-managed"; // penanda agar mudah dibersihkan saat route berubah

    const prevTitle = document.title;
    const fullTitle = title ? `${title} | My Portfolio` : "My Portfolio";
    document.title = fullTitle;

    // canonical + URLs
    const canonical = toAbsUrl(path);
    const ogImage = toAbsUrl(image);

    // name metas
    const mDesc = upsertMetaByName("description", description, id);
    const mRobots = upsertMetaByName("robots", robots, id);

    // canonical
    const lCanon = upsertCanonical(canonical, id);

    // Open Graph
    const ogType = upsertMetaByProp("og:type", type, id);
    const ogTitle = upsertMetaByProp("og:title", fullTitle, id);
    const ogDesc = upsertMetaByProp("og:description", description, id);
    const ogUrl  = upsertMetaByProp("og:url", canonical, id);
    const ogSite = upsertMetaByProp("og:site_name", "My Portfolio", id);
    const ogImg  = upsertMetaByProp("og:image", ogImage, id);
    const ogW    = upsertMetaByProp("og:image:width", "1200", id);
    const ogH    = upsertMetaByProp("og:image:height", "630", id);
    const ogAlt  = upsertMetaByProp("og:image:alt", title || "My Portfolio", id);

    // Twitter
    const twCard = upsertMetaByName("twitter:card", "summary_large_image", id);
    const twTitle= upsertMetaByName("twitter:title", fullTitle, id);
    const twDesc = upsertMetaByName("twitter:description", description, id);
    const twImg  = upsertMetaByName("twitter:image", ogImage, id);

    // JSON-LD
    const ld = upsertJsonLd(jsonLd, id);

    // Cleanup saat unmount: hapus tag yang kita buat, kembalikan title
    return () => {
      document.title = prevTitle;
      document.head
        .querySelectorAll(`[data-seo="${id}"]`)
        .forEach((n) => n.parentNode?.removeChild(n));
    };
  }, [title, description, path, type, image, robots, JSON.stringify(jsonLd)]);

  return null;
}
