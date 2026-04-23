self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('portfolio-cache').then(function(cache) {
      return cache.addAll([
        '/',
        'index.html',
        'styles.css',
        'script.js',
        'bilal.jpg'
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