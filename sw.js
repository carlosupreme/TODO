const cacheName = "workout-v1";

const staticAssets = [
  "./",
  "./index.html",
  "./index.js",
  "./offline_script.js",
  "./manifest.webmanifest",
  "./img/icon.png",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
];

self.addEventListener("install", async () => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  self.clients.claim();
});

self.addEventListener("fetch", async (e) => {
  const url = new URL(e.request.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(e.request));
  } else {
    e.respondWith(networkAndCache(e.request));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(req)
    return cached
  }
}
