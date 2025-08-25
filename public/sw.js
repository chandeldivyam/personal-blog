// public/sw.js
const CACHE_VERSION = 'v1';
const CACHE_NAME = `blog-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const STATIC_CACHE_URLS = [
  '/',
  '/blog',
  '/about',
  '/offline.html',
  '/favicon.ico',
  // Add your CSS/JS bundles here after build
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Network first, fallback to cache (for HTML pages)
  networkFirst: [
    /\.html$/,
    /^\/$/,
    /^\/blog\/?$/,
    /^\/about\/?$/,
    /^\/blog\/[^/]+\/?$/
  ],
  // Cache first, update in background (for assets)
  cacheFirst: [
    /\.css$/,
    /\.js$/,
    /\.woff2?$/,
    /\.ttf$/,
    /\.otf$/
  ],
  // Cache first, never update (for immutable assets)
  cacheOnly: [
    /\/_astro\//,  // Astro's hashed assets
    /\/assets\/.*\.[a-f0-9]{8}\./  // Hashed assets
  ],
  // Stale while revalidate (for images)
  staleWhileRevalidate: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/
  ]
};

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Service worker installed');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName.startsWith('blog-cache-'))
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip admin/external URLs
  if (url.origin !== location.origin) return;
  
  // Determine strategy based on request
  const strategy = getStrategy(request);
  
  event.respondWith(
    handleRequest(request, strategy).catch(() => {
      // If it's a navigation request, show offline page
      if (request.mode === 'navigate') {
        return caches.match(OFFLINE_URL);
      }
      // Otherwise return a 503 response
      return new Response('Service Unavailable', { status: 503 });
    })
  );
});

// Determine caching strategy for request
function getStrategy(request) {
  const url = request.url;
  
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pattern.test(url))) {
      return strategy;
    }
  }
  
  // Default strategy
  return 'networkFirst';
}

// Handle request based on strategy
async function handleRequest(request, strategy) {
  const cache = await caches.open(CACHE_NAME);
  
  switch (strategy) {
    case 'cacheOnly':
      return cacheOnly(cache, request);
    
    case 'cacheFirst':
      return cacheFirst(cache, request);
    
    case 'networkFirst':
      return networkFirst(cache, request);
    
    case 'staleWhileRevalidate':
      return staleWhileRevalidate(cache, request);
    
    default:
      return fetch(request);
  }
}

// Strategy: Cache only (for immutable assets)
async function cacheOnly(cache, request) {
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('[SW] Cache hit (cache-only):', request.url);
    return cachedResponse;
  }
  
  // If not in cache, fetch and cache it (shouldn't happen often)
  console.log('[SW] Cache miss (cache-only), fetching:', request.url);
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    await cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Strategy: Cache first, fallback to network
async function cacheFirst(cache, request) {
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('[SW] Cache hit (cache-first):', request.url);
    return cachedResponse;
  }
  
  console.log('[SW] Cache miss (cache-first), fetching:', request.url);
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    await cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Strategy: Network first, fallback to cache
async function networkFirst(cache, request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      console.log('[SW] Network success (network-first):', request.url);
      // Update cache with fresh response
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Cache hit (network-first fallback):', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Strategy: Stale while revalidate (return cache immediately, update in background)
async function staleWhileRevalidate(cache, request) {
  const cachedResponse = await cache.match(request);
  
  // Fetch in background and update cache
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      console.log('[SW] Background update:', request.url);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  if (cachedResponse) {
    console.log('[SW] Serving stale cache:', request.url);
    return cachedResponse;
  }
  
  console.log('[SW] No cache, waiting for network:', request.url);
  return fetchPromise;
}

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.payload;
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urls))
      .then(() => {
        console.log('[SW] Cached URLs:', urls);
      });
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    console.log('[SW] Performing background cache update');
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  // Update HTML pages in the background
  const updates = requests
    .filter(request => request.url.endsWith('.html') || request.url.endsWith('/'))
    .map(request => {
      return fetch(request).then(response => {
        if (response.ok) {
          return cache.put(request, response);
        }
      }).catch(() => {});
    });
  
  return Promise.all(updates);
}