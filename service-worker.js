const CACHE_NAME = "hvs-cache-v3";

const urlsToCache = [
  "/",
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

// 🟢 Cài đặt
self.addEventListener("install", event => {
  console.log("SW: Installing...");

  self.skipWaiting(); // 🔥 update ngay

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 🟢 Kích hoạt + xóa cache cũ
self.addEventListener("activate", event => {
  console.log("SW: Activating...");

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key); // 🔥 XÓA BẢN CŨ
          }
        })
      );
    })
  );

  return self.clients.claim(); // 🔥 áp dụng ngay
});

// 🟢 Fetch (offline vẫn chạy)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// 🔔 Lắng nghe message từ client (web)
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
