export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://adityaanugrah.me').replace(/\/+$/, '');
export const SITE_NAME = import.meta.env?.VITE_SITE_NAME || 'Aditya Anugrah';

export function seoTitle(title, siteName=SITE_NAME, template) {
  if(template)return template.replace(/%s/g,String(title||siteName));
  const parts=String(title||'').split(/\s+[|–]\s+/).filter(part=>part.toLowerCase()!==siteName.toLowerCase());
  return [...parts,siteName].filter(Boolean).join(' | ');
}

export function canonicalPath(path) {
  const clean=String(path||'/').split(/[?#]/)[0].replace(/\/{2,}/g,'/');
  return clean==='/'?'/':clean.replace(/\/+$/,'');
}

export function robotsValue(value) {
  if(value===false)return 'noindex,nofollow';
  if(value===true||!value)return 'index,follow';
  return Array.isArray(value)?value.join(','):String(value);
}
