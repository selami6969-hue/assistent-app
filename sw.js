// Nur die App-Hülle (diese Beispiel-Seite) wird für den Offline-Start gemerkt; keine Eingaben, keine Daten.
const V = 'assistent-661e111e02', DATEIEN = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(DATEIEN.map((d) => new Request(d, { cache: 'reload' }))))); });   // kein stilles skipWaiting: der neue Stand wartet (Sicherheit S3); am HTTP-Cache vorbei, sonst alter Stand unter neuer Version
self.addEventListener('message', (e) => { try { if (e.data === 'weiter' && e.source && String(e.source.url).startsWith(self.registration.scope)) self.skipWaiting(); } catch (x) { /* fremde/ungültige Quelle: nichts tun */ } });   // nur nach Tippen auf „Neue Version“, nur aus dem App-Bereich
self.addEventListener('activate', (e) => { if (self.registration.installing || self.registration.waiting) return;   // ein neuerer Stand installiert gerade: dessen Cache nicht löschen, er räumt selbst auf (ChatGPT cfdd08)
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n.startsWith('assistent-') && n !== V).map((n) => caches.delete(n))))); });   // nur eigene Caches (geteilte Herkunft)
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.open(V).then((c) => c.match(e.request, { ignoreSearch: true })).then((r) => r || fetch(e.request)));   // nur der eigene Cache
});
