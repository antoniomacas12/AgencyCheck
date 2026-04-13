// AgencyCheck — cache-clearing service worker
// Installs immediately, wipes any previously cached responses (which could
// cause stale redirects or wrong-page navigations), then takes control.

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function () {
      return clients.claim();
    })
  );
});
