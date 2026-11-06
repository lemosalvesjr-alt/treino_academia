// service-worker.js
const CACHE_NAME = 'treino-academia-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './js/workout.js',
  './js/timer.js',
  './data/exercises.json',
  './assets/icons/repdb-icon-180.png',
  './assets/icons/repdb-dataset-icon.svg',
  './assets/illustrations/pushup.svg',
  './assets/illustrations/squat.svg',
  './assets/illustrations/lunges.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cacheia sob demanda imagens adicionais de exercícios conforme forem carregadas
        if (
          networkResponse.status === 200 &&
          event.request.url.includes('/assets/images/')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback offline se necessário
        if (event.request.destination === 'image') {
          return caches.match('./assets/illustrations/pushup.svg');
        }
      });
    })
  );
});
