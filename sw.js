self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('portfolio-cache').then(function(cache) {
      return cache.addAll([
        '/bilalportfolio/',
        '/bilalportfolio/index.html',
        '/bilalportfolio/styles.css',
        '/bilalportfolio/script.js',
        '/bilalportfolio/bilal.jpg',
        '/bilalportfolio/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});