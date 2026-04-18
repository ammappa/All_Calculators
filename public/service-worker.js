const CACHE_NAME = "withinsecs-v2";
const STATIC_ASSETS = ["/", "/calculators", "/blog", "/search", "/offline", "/logo.png"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => undefined)
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

function isPageRequest(request) {
    return request.mode === "navigate";
}

function isSameOrigin(url) {
    return url.origin === self.location.origin;
}

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    const requestUrl = new URL(event.request.url);

    if (!isSameOrigin(requestUrl)) {
        return;
    }

    if (isPageRequest(event.request)) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const responseClone = response.clone();
                    void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    return response;
                })
                .catch(async () => {
                    const cached = await caches.match(event.request);
                    return cached || caches.match("/offline");
                })
        );
        return;
    }

    if (requestUrl.pathname.startsWith("/_next/") || /\.(?:js|css|png|jpg|jpeg|svg|webp|avif|ico)$/i.test(requestUrl.pathname)) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) {
                    return cached;
                }

                return fetch(event.request).then((response) => {
                    const responseClone = response.clone();
                    void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    return response;
                });
            })
        );
    }
});
