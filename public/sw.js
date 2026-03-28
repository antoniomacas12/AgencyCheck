// AgencyCheck — no-op service worker
// Prevents browsers from logging a 404 when they auto-probe for /sw.js.
// This worker installs immediately and does nothing else.

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(clients.claim());
});
