// Network-first: online always gets the latest deploy; offline falls back to whatever was cached.
// ponytail: no precache — works offline only after one online visit; old hashed assets pile up in the cache
// (tiny app). Switch to vite-plugin-pwa if that ever matters.
const CACHE = 'claude-cert-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
        }
        return res
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || Response.error())),
  )
})
