const CACHE_NAME = 'graderelay-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Only cache GET requests
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
