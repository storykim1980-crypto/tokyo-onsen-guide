const CACHE_NAME = "TokyoOnsenCache_v5_3";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./data.json?v=5.3",
  "./manifest.json",
  "./robots.txt",
  "./sitemap.xml",
  "./pages/about.html",
  "./pages/privacy.html",
  "./pages/terms.html",
  "./pages/cookies.html",
  "./pages/contact.html",
  "./pages/advertising.html"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  
  // Stale-while-revalidate for data.json and index.html
  if (url.pathname.endsWith("data.json") || url.pathname.endsWith("index.html") || url.pathname === "/") {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Cache first for images and static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && url.pathname.includes("/images/")) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for images
        if (event.request.destination === "image") {
          return caches.match("./images/hero-onsen.jpg");
        }
      });
    })
  );
});