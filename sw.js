// service-worker.js
const VERSION = 'v1';
const CACHE_NAME = `my-cache-${VERSION}`;

const APP_STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/scripts/api.js',
  '/scripts/main.js',
  '/scripts/model.js',
  '/scripts/presenter.js',
  '/scripts/view.js',
  '/css/style.css',
  '/json/tasks-static.json',
];




self.addEventListener('install', (event) => {
    event.waitUntil(
        (async function () {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(APP_STATIC_RESOURCES);
        })(),
    );
  console.log('[SW] Installed');
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(
    (async function () {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
          return undefined;
        }),
      );
      await clients.claim();
    })(),
  );
});
