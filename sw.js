/* eslint-disable no-restricted-globals */

/*
 * This example was based by example from Google injectGlobal`
 * https://developers.google.com/web/fundamentals/primers/service-workers/
 * and
 * https://medium.com/@anatomic/using-a-service-worker-with-next-js-460e0168a60a
*/

const CACHE_NAME = 'matheusalves-dev-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/scripts.js',
];

self.addEventListener('install', (event) => {
  const preLoaded = caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache));
  event.waitUntil(preLoaded);
});

self.addEventListener('fetch', (event) => {
  const response = caches.match(event.request)
    .then(match => match || fetch(event.request));
  event.respondWith(response);
});