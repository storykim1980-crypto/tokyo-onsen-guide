const CACHE_NAME = 'unsemill-v1.0-cache';
const ASSETS_TO_CACHE = [
  './index.html',
  './about.html',
  './contact.html',
  './privacy.html',
  './manifest.json',
  './css/style.css?v=20260721-195925',
  './js/app.js?v=20260721-195925',
  './data/fortune-data.json?v=20260721-195925',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=Noto+Serif+KR:wght@400;600;700&display=swap'
];

// 1. 서비스 워커 설치 및 핵심 자원 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching unsemill core assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. 서비스 워커 활성화 및 오래된 캐시 청소
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 네트워크 우선 요청 처리 (실시간 운세 변경 반영을 위해 Network First 후 Cache Fallback)
self.addEventListener('fetch', (event) => {
  // POST 또는 타사 API 등은 캐싱하지 않음
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // 성공 시 캐시 갱신
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // 오프라인 상태일 경우 캐시에서 우선 반환
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          // 만약 전체 탐색(네비게이션) 중 실패하면 메인 index.html 제공
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});