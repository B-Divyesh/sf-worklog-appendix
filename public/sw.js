const CACHE = 'worklog-appendix-__CACHE_VERSION__';
const CACHE_PREFIX = 'worklog-appendix-';
const ASSETS = ['/', '/demo', '/privacy', '/terms', '/workspace', '/assets/hero.webp', '/favicon.svg', '/apple-touch-icon.svg'];

self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
));
self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())
));
self.addEventListener('message', event => {
  if (event.data?.type !== 'precache' || !Array.isArray(event.data.urls)) return;
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(event.data.urls)));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match(event.request).then(hit => hit || caches.match('/'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
