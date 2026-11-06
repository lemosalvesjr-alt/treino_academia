// service-worker.js
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

const EXERCISE_IMAGES = [
  "./assets/images/flat/90-90-hold-main.webp",
  "./assets/images/flat/90-90-switch-start.webp",
  "./assets/images/flat/archer-push-ups-start.webp",
  "./assets/images/flat/back-extension-start.webp",
  "./assets/images/flat/bear-crawl-start.webp",
  "./assets/images/flat/bear-plank-hold-main.webp",
  "./assets/images/flat/bench-decline-plank-hold-main.webp",
  "./assets/images/flat/bench-dips-start.webp",
  "./assets/images/flat/bench-leg-pull-in-start.webp",
  "./assets/images/flat/bicycle-crunch-start.webp",
  "./assets/images/flat/bird-dog-start.webp",
  "./assets/images/flat/bird-dog-hold-main.webp",
  "./assets/images/flat/boat-pose-main.webp",
  "./assets/images/flat/bodyweight-calf-raise-start.webp",
  "./assets/images/flat/bodyweight-good-morning-start.webp",
  "./assets/images/flat/bodyweight-lateral-raise-start.webp",
  "./assets/images/flat/bodyweight-overhead-press-start.webp",
  "./assets/images/flat/bodyweight-reverse-lunge-start.webp",
  "./assets/images/flat/bodyweight-squat-start.webp",
  "./assets/images/flat/bow-pose-main.webp",
  "./assets/images/flat/box-squat-start.webp",
  "./assets/images/flat/burpees-main.webp",
  "./assets/images/flat/butterfly-stretch-main.webp",
  "./assets/images/flat/calf-raise-hold-main.webp",
  "./assets/images/flat/camel-pose-main.webp",
  "./assets/images/flat/captains-chair-knee-raise-start.webp",
  "./assets/images/flat/captains-chair-leg-raise-start.webp",
  "./assets/images/flat/cat-cow-main.webp",
  "./assets/images/flat/cat-stretch-main.webp",
  "./assets/images/flat/chair-pose-main.webp",
  "./assets/images/flat/childs-pose-main.webp",
  "./assets/images/flat/chin-tuck-hold-main.webp",
  "./assets/images/flat/clamshells-start.webp",
  "./assets/images/flat/clamshells-hold-main.webp",
  "./assets/images/flat/clap-push-ups-start.webp",
  "./assets/images/flat/close-grip-push-ups-start.webp",
  "./assets/images/flat/cobra-stretch-main.webp",
  "./assets/images/flat/cocoons-start.webp",
  "./assets/images/flat/cossack-squat-start.webp",
  "./assets/images/flat/cow-face-pose-main.webp",
  "./assets/images/flat/crab-dips-start.webp",
  "./assets/images/flat/crescent-lunge-main.webp",
  "./assets/images/flat/cross-body-crunch-start.webp",
  "./assets/images/flat/cross-body-shoulder-stretch-main.webp",
  "./assets/images/flat/crow-pose-main.webp",
  "./assets/images/flat/crunches-start.webp",
  "./assets/images/flat/dancer-pose-main.webp",
  "./assets/images/flat/dead-bug-start.webp",
  "./assets/images/flat/dead-bug-hold-main.webp",
  "./assets/images/flat/decline-crunch-start.webp",
  "./assets/images/flat/decline-push-up-start.webp",
  "./assets/images/flat/deep-squat-hold-main.webp",
  "./assets/images/flat/deficit-push-ups-start.webp",
  "./assets/images/flat/diamond-push-ups-start.webp",
  "./assets/images/flat/dolphin-pose-main.webp",
  "./assets/images/flat/donkey-calf-raise-start.webp",
  "./assets/images/flat/doorway-chest-stretch-main.webp",
  "./assets/images/flat/downward-dog-main.webp",
  "./assets/images/flat/downward-dog-knee-tuck-start.webp",
  "./assets/images/flat/downward-dog-pedal-start.webp",
  "./assets/images/flat/downward-dog-to-knee-drive-start.webp",
  "./assets/images/flat/downward-dog-to-low-lunge-start.webp",
  "./assets/images/flat/downward-dog-to-plank-start.webp",
  "./assets/images/flat/downward-dog-to-upward-dog-start.webp",
  "./assets/images/flat/dragon-flag-start.webp",
  "./assets/images/flat/eagle-pose-main.webp",
  "./assets/images/flat/easy-pose-main.webp",
  "./assets/images/flat/extended-side-angle-main.webp",
  "./assets/images/flat/fire-hydrant-start.webp",
  "./assets/images/flat/fish-pose-main.webp",
  "./assets/images/flat/flutter-kicks-start.webp",
  "./assets/images/flat/frog-stretch-main.webp",
  "./assets/images/flat/garland-pose-main.webp",
  "./assets/images/flat/glute-bridge-start.webp",
  "./assets/images/flat/glute-bridge-hold-main.webp",
  "./assets/images/flat/glute-kickback-start.webp",
  "./assets/images/flat/glute-kickback-hold-main.webp",
  "./assets/images/flat/half-kneeling-hip-flexor-rock-start.webp",
  "./assets/images/flat/half-moon-pose-main.webp",
  "./assets/images/flat/handstand-hold-main.webp",
  "./assets/images/flat/handstand-push-ups-start.webp",
  "./assets/images/flat/happy-baby-main.webp",
  "./assets/images/flat/head-to-knee-pose-main.webp",
  "./assets/images/flat/heel-flicks-main.webp",
  "./assets/images/flat/heel-to-toe-walk-main.webp",
  "./assets/images/flat/heel-touches-start.webp",
  "./assets/images/flat/hero-pose-main.webp",
  "./assets/images/flat/high-knees-main.webp",
  "./assets/images/flat/high-plank-main.webp",
  "./assets/images/flat/hollow-body-hold-main.webp",
  "./assets/images/flat/hyperextension-hold-bench-main.webp",
  "./assets/images/flat/inchworm-start.webp",
  "./assets/images/flat/incline-push-ups-start.webp",
  "./assets/images/flat/isometric-neck-side-main.webp",
  "./assets/images/flat/isometric-split-squat-main.webp",
  "./assets/images/flat/jackknife-sit-up-start.webp",
  "./assets/images/flat/jump-squat-start.webp",
  "./assets/images/flat/jumping-jacks-start.webp",
  "./assets/images/flat/knee-push-ups-start.webp",
  "./assets/images/flat/knee-to-chest-stretch-main.webp",
  "./assets/images/flat/kneeling-hip-flexor-stretch-main.webp",
  "./assets/images/flat/kneeling-wrist-stretch-main.webp",
  "./assets/images/flat/lateral-leg-swing-start.webp",
  "./assets/images/flat/lean-back-90-90-hold-main.webp",
  "./assets/images/flat/leg-swing-front-to-back-start.webp",
  "./assets/images/flat/legs-up-the-wall-main.webp",
  "./assets/images/flat/lizard-stretch-main.webp",
  "./assets/images/flat/locust-pose-main.webp",
  "./assets/images/flat/low-lunge-main.webp",
  "./assets/images/flat/low-lunge-to-half-split-start.webp",
  "./assets/images/flat/lunge-start.webp",
  "./assets/images/flat/lying-leg-raise-start.webp",
  "./assets/images/flat/lying-quad-stretch-main.webp",
  "./assets/images/flat/mountain-climbers-start.webp",
  "./assets/images/flat/mountain-pose-main.webp",
  "./assets/images/flat/neck-side-stretch-main.webp",
  "./assets/images/flat/overhead-triceps-stretch-main.webp",
  "./assets/images/flat/pigeon-stretch-main.webp",
  "./assets/images/flat/pike-push-ups-start.webp",
  "./assets/images/flat/pilates-kneeling-side-kick-start.webp",
  "./assets/images/flat/pilates-leg-pull-back-start.webp",
  "./assets/images/flat/pilates-leg-pull-front-start.webp",
  "./assets/images/flat/pilates-roll-down-start.webp",
  "./assets/images/flat/pilates-roll-over-start.webp",
  "./assets/images/flat/pilates-saw-start.webp",
  "./assets/images/flat/pilates-side-bend-start.webp",
  "./assets/images/flat/pilates-spine-stretch-forward-start.webp",
  "./assets/images/flat/pilates-spine-twist-start.webp",
  "./assets/images/flat/pistol-squat-start.webp",
  "./assets/images/flat/planche-main.webp",
  "./assets/images/flat/planche-lean-floor-main.webp",
  "./assets/images/flat/plank-main.webp",
  "./assets/images/flat/plank-knee-tuck-start.webp",
  "./assets/images/flat/plow-pose-main.webp",
  "./assets/images/flat/plyo-lunge-start.webp",
  "./assets/images/flat/plyo-push-up-start.webp",
  "./assets/images/flat/pseudo-planche-push-ups-start.webp",
  "./assets/images/flat/puppy-pose-main.webp",
  "./assets/images/flat/push-up-start.webp",
  "./assets/images/flat/pyramid-pose-main.webp",
  "./assets/images/flat/reclined-butterfly-main.webp",
  "./assets/images/flat/reverse-crunches-start.webp",
  "./assets/images/flat/reverse-nordic-curl-start.webp",
  "./assets/images/flat/reverse-plank-main.webp",
  "./assets/images/flat/reverse-plank-dips-start.webp",
  "./assets/images/flat/reverse-tabletop-hip-pulses-start.webp",
  "./assets/images/flat/reverse-tabletop-hold-main.webp",
  "./assets/images/flat/revolved-chair-pose-main.webp",
  "./assets/images/flat/revolved-crescent-lunge-main.webp",
  "./assets/images/flat/running-main.webp",
  "./assets/images/flat/russian-twist-start.webp",
  "./assets/images/flat/savasana-main.webp",
  "./assets/images/flat/scissor-kicks-start.webp",
  "./assets/images/flat/seated-forward-fold-main.webp",
  "./assets/images/flat/seated-spinal-twist-main.webp",
  "./assets/images/flat/seated-straddle-stretch-main.webp",
  "./assets/images/flat/shrimp-squat-start.webp",
  "./assets/images/flat/side-lunge-start.webp",
  "./assets/images/flat/side-lying-hip-abduction-start.webp",
  "./assets/images/flat/side-lying-hip-abduction-hold-main.webp",
  "./assets/images/flat/side-lying-hip-adduction-start.webp",
  "./assets/images/flat/side-lying-hip-adduction-hold-main.webp",
  "./assets/images/flat/side-plank-main.webp",
  "./assets/images/flat/side-plank-leg-lift-start.webp",
  "./assets/images/flat/side-plank-leg-lift-hold-main.webp",
  "./assets/images/flat/single-arm-plank-main.webp",
  "./assets/images/flat/single-leg-calf-raise-start.webp",
  "./assets/images/flat/single-leg-glute-bridge-start.webp",
  "./assets/images/flat/single-leg-glute-bridge-hold-main.webp",
  "./assets/images/flat/single-leg-rdl-hold-main.webp",
  "./assets/images/flat/sit-ups-start.webp",
  "./assets/images/flat/six-inch-hold-main.webp",
  "./assets/images/flat/sphinx-pose-main.webp",
  "./assets/images/flat/spiderman-push-up-start.webp",
  "./assets/images/flat/split-squat-start.webp",
  "./assets/images/flat/squat-hold-main.webp",
  "./assets/images/flat/squat-pulse-start.webp",
  "./assets/images/flat/standing-adductor-stretch-main.webp",
  "./assets/images/flat/standing-calf-stretch-main.webp",
  "./assets/images/flat/standing-forward-fold-main.webp",
  "./assets/images/flat/standing-forward-fold-to-half-lift-start.webp",
  "./assets/images/flat/standing-hip-abduction-start.webp",
  "./assets/images/flat/standing-quad-stretch-main.webp",
  "./assets/images/flat/standing-side-bend-main.webp",
  "./assets/images/flat/standing-side-bend-flow-start.webp",
  "./assets/images/flat/standing-split-main.webp",
  "./assets/images/flat/step-up-to-balance-start.webp",
  "./assets/images/flat/step-ups-start.webp",
  "./assets/images/flat/superman-start.webp",
  "./assets/images/flat/supine-spinal-twist-main.webp",
  "./assets/images/flat/supine-windshield-wipers-start.webp",
  "./assets/images/flat/supported-shoulderstand-main.webp",
  "./assets/images/flat/supported-single-leg-stand-main.webp",
  "./assets/images/flat/tandem-stance-main.webp",
  "./assets/images/flat/thoracic-bridge-main.webp",
  "./assets/images/flat/thread-the-needle-main.webp",
  "./assets/images/flat/thread-the-needle-flow-start.webp",
  "./assets/images/flat/three-legged-dog-main.webp",
  "./assets/images/flat/torso-twists-main.webp",
  "./assets/images/flat/tree-pose-main.webp",
  "./assets/images/flat/triangle-pose-main.webp",
  "./assets/images/flat/triceps-dip-hold-bench-main.webp",
  "./assets/images/flat/upward-dog-main.webp",
  "./assets/images/flat/v-sit-main.webp",
  "./assets/images/flat/v-ups-start.webp",
  "./assets/images/flat/walking-main.webp",
  "./assets/images/flat/walking-lunge-start.webp",
  "./assets/images/flat/wall-hamstring-stretch-main.webp",
  "./assets/images/flat/wall-push-ups-start.webp",
  "./assets/images/flat/wall-sit-main.webp",
  "./assets/images/flat/warrior-one-main.webp",
  "./assets/images/flat/warrior-three-main.webp",
  "./assets/images/flat/warrior-two-main.webp",
  "./assets/images/flat/wide-grip-push-ups-start.webp",
  "./assets/images/flat/wide-legged-forward-fold-main.webp",
  "./assets/images/flat/worlds-greatest-stretch-start.webp"
];

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
