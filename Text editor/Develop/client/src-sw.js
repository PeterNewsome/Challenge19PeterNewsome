const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
// Caching CSS and JavaScript files
registerRoute(
  // Define a filter for CSS and JS files
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  
  // Use a CacheFirst strategy for these files
  new CacheFirst({
    cacheName: 'asset-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum age of 60 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        // Only cache requests for a max of 60 days
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
        // Only cache 20 items
        maxEntries: 20,
      }),
    ],
  })
);
