const CACHE_NAME = "hvs-" + "v20"; // 🔥 đổi version mỗi lần update
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Cài đặt SW + cache
self.addEventListener("install", event => {
  self.skipWaiting(); // 🔥 bắt buộc để update ngay
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Kích hoạt SW mới
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 🔥 xóa cache cũ
          }
        })
      )
    )
  );
  self.clients.claim(); // 🔥 chiếm quyền ngay
});

// Fetch (luôn lấy bản mới trước)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        });
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener("message", event => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
