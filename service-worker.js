// service-worker.js

self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  self.skipWaiting(); // Optional: activate immediately
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
});


self.addEventListener('fetch', event => {
  // Only handle same-origin requests
  console.log(event);
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request).catch(error => {
        console.error('[SW] Fetch failed for', event.request.url, error);
        return new Response('Service unavailable', { status: 503 });
      })
    );
  }
});

