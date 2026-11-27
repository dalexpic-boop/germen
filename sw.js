// Service worker: caché "cache-first" de todos los archivos (SPEC.md §11).
// VERSION la calcula tools/version.js a partir del contenido; no la edites a mano.
const VERSION = "5bfd25328c";
const CACHE = "germen-" + VERSION;

const ARCHIVOS = [
  "./",
  "index.html",
  "manifest.json",
  "config.js",
  "css/estilos.css",
  "js/frase.js",
  "js/generador.js",
  "js/respaldo.js",
  "js/app.js",
  "data/estilos.js",
  "data/tratamiento.js",
  "data/foco.js",
  "data/elementos.js",
  "data/estados.js",
  "data/relaciones.js",
  "data/formatos.js",
  "data/conceptos.js",
  "data/pares.js",
  "data/universos.js",
  "data/zonas.js",
  "data/reglas.js",
  "icons/icono-192.png",
  "icons/icono-512.png",
  "icons/icono-maskable-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (ev) => {
  // cache: "reload" evita copiar versiones viejas desde la caché HTTP del navegador.
  ev.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS.map((u) => new Request(u, { cache: "reload" })))));
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k.startsWith("germen-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// La página pide activar la versión nueva cuando el usuario toca "recargar".
self.addEventListener("message", (ev) => {
  if (ev.data === "activar") self.skipWaiting();
});

self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  ev.respondWith(
    caches.match(req, { ignoreSearch: true }).then((r) => {
      if (r) return r;
      if (req.mode === "navigate") return caches.match("index.html").then((i) => i || fetch(req));
      return fetch(req);
    })
  );
});
