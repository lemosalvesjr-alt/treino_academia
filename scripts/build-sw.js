import fs from 'fs';

const imgs = JSON.parse(fs.readFileSync('data/bodyweight-images.json', 'utf8'));

const code = `// service-worker.js
// Cache offline v4 - Pre-carrega todas as 216 ilustrações dos exercícios de peso corporal
const CACHE_NAME = 'treino-academia-v4';

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
  './assets/illustrations/placeholder.svg',
];

const EXERCISE_IMAGES = ${JSON.stringify(imgs, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Garante os arquivos essenciais da aplicação primeiro
      await cache.addAll(STATIC_ASSETS);
      // 2. Pre-cacheia todas as 216 ilustrações de exercícios em segundo plano
      return Promise.allSettled(
        EXERCISE_IMAGES.map((url) => cache.add(url))
      );
    })
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
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback offline caso a imagem não tenha sido encontrada
        if (
          event.request.destination === 'image' ||
          event.request.url.includes('/assets/')
        ) {
          return caches.match('./assets/illustrations/pushup.svg');
        }
      });
    })
  );
});
`;

fs.writeFileSync('service-worker.js', code, 'utf8');
console.log('service-worker.js written successfully with v4 and ' + imgs.length + ' images');
