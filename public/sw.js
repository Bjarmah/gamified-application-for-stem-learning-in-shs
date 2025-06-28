
const CACHE_NAME = 'stem-stars-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache successful responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Network failed, check if we have a cached fallback
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // For API requests, return a custom offline response
            if (event.request.url.includes('/api/')) {
              return new Response(JSON.stringify({
                error: 'Offline',
                message: 'You are currently offline. Please check your connection.'
              }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            
            return new Response('You are offline', { status: 503 });
          });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(
      // Sync any pending data when connection is restored
      syncPendingData()
    );
  }
});

async function syncPendingData() {
  try {
    // This would sync any pending user progress or quiz attempts
    // stored in IndexedDB back to the server
    console.log('Syncing pending data...');
    
    // Send a message to the main thread to handle sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_PENDING_DATA'
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
