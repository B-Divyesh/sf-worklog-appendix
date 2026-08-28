const CACHE='worklog-appendix-v1';
const ASSETS=['/','/demo','/privacy','/terms','/assets/hero.webp','/favicon.svg','/apple-touch-icon.svg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => {
  if (event.data?.type !== 'precache' || !Array.isArray(event.data.urls)) return;
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(event.data.urls)));
});
self.addEventListener('fetch', event => { if(event.request.method !== 'GET') return; event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => { const copy=response.clone(); if(new URL(event.request.url).origin===location.origin) caches.open(CACHE).then(c=>c.put(event.request,copy)); return response; }).catch(() => caches.match('/')))); });
