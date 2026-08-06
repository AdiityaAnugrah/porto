const CACHE_NAME = 'porto-speed-v5';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/favicon-32.png',
  '/assets/aa-mark-primary.png'
];
const NETWORK_FALLBACK = new Response('', {
  status: 504,
  statusText: 'Network unavailable'
});

// Install: Cache critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

const shouldHandleRequest = (request, url) => {
  if (request.method !== 'GET') return false;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  return url.origin === self.location.origin;
};

const cacheable = (response) => response && response.ok && response.type !== 'opaque';

const putCache = (request, response) => {
  if (!cacheable(response)) return response;
  caches.open(CACHE_NAME)
    .then((cache) => cache.put(request, response.clone()))
    .catch(() => {});
  return response;
};

const cachedOrNetworkFallback = (request) =>
  caches.match(request).then((cached) => cached || NETWORK_FALLBACK.clone());

// Fetch Strategy: handle only same-origin assets/pages.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!shouldHandleRequest(request, url)) {
    return;
  }

  // Strategy 1: Cache First for Fonts & Images (Static)
  if (request.destination === 'font' || request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => putCache(request, response));
      }).catch(() => NETWORK_FALLBACK.clone())
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => putCache(request, response))
        .catch(() => caches.match('/index.html').then((cached) => cached || NETWORK_FALLBACK.clone()))
    );
    return;
  }

  // Strategy 2: Network First (with Cache fallback) for same-origin scripts/pages.
  event.respondWith(
    fetch(request)
      .then((response) => putCache(request, response))
      .catch(() => cachedOrNetworkFallback(request))
  );
});
