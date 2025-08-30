// public/sw.js
// 💡 cambia la versión en cada deploy importante:
const VERSION = "v7";
// Incluye el host para que diferentes dominios/previas no compartan caché
const CACHE = `ritual-${VERSION}-${self.location.host}`;

const CORE_ASSETS = ["/", "/manifest.json"]; // añade iconos si quieres: "/icons/icon-192.png", etc.

self.addEventListener("install", (event) => {
  // Precarga núcleo y activa de inmediato
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Limpia versiones antiguas
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estrategia:
// - Para navegaciones (HTML): network-first, fallback a caché "/" si estás offline
// - Para el resto: intenta red y guarda en caché; si falla, usa caché
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // NAVIGATE => HTML (evita pantalla en blanco por HTML cacheado)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // opcional: actualiza la home en caché
          caches.open(CACHE).then((c) => c.put("/", res.clone())).catch(() => {});
          return res;
        })
        .catch(async () => {
          const cached = await caches.match("/");
          return cached || new Response("Offline", { status: 503, statusText: "Offline" });
        })
    );
    return;
  }

  // Otros recursos: network -> cache fallback
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req))
  );
});
