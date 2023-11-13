const CACHE_VERSION = 6;
const CURRENT_CACHES = [
    {
        name: `3d-models-cache-v${CACHE_VERSION}`,
        contentTypeMatch: null, ///^model\//i,
        urlMatch: /\.glb/
    },
    {
        name: `fonts-cache-v${CACHE_VERSION}`,
        contentTypeMatch: null, ///^font\//i,
        urlMatch: /\.ttf|\.otf/i,
    },
    {
        name: `wp-includes-scripts-cache-v${CACHE_VERSION}`,
        contentTypeMatch: /\/javascript/i,
        urlMatch: /wp\/wp-includes/i
    },
    {
        name: `wp-includes-css-cache-v${CACHE_VERSION}`,
        contentTypeMatch: /\/css/i,
        urlMatch: /wp\/wp-includes/i
    },
    {
        name: `xp-scripts-cache-v${CACHE_VERSION}`,
        contentTypeMatch: /\/javascript/i,
        urlMatch: /xp-theme\/public\/js\//i
    },
    {
        name: `xp-styles-cache-v${CACHE_VERSION}`,
        contentTypeMatch: /\/css/i,
        urlMatch: /xp-theme\/public\/css\//i
    }
];

const getSupportedCaches = () => new Set(CURRENT_CACHES.map(cache => cache.name));

const clearCaches = async () => {
    const cacheNames = await caches.keys();
    const supportedCaches = getSupportedCaches();


    for(const index in cacheNames) {
        const cacheName = cacheNames[index];
        if(supportedCaches.has(cacheName)) continue;

        console.log(`sw - purging cache`, cacheName);
        await caches.delete(cacheName);
    }
};

const openCache = async (name) => {
    try {
        return await caches.open(name);
    } catch(e) {
        console.log(`sw - failed to open cache ${name}, `, e);
        return false;
    }
}

const evaluateCaches = async (request) => {
    for(const index in CURRENT_CACHES) {
        const currentCache = CURRENT_CACHES[index];

        const cache = await openCache(currentCache.name);
        if(!cache) {
            console.log('sw - failed to open cache', currentCache.name);
        }

        const response = await cache.match(request);
        if(response) {
            console.log('sw - found cache it at', request.url);
            return response;
        }
    }

    return null;
};

const storeCacheResponse = async (request, response) => {
    if(response.status >= 400) {
        console.log('sw - not storing erroneous status code', response.status);
        return;
    }

    if(!response.headers.has('content-type')) {
        console.log('sw - not storing response with missing content-type', request.url);
        return;
    }

    for(const index in CURRENT_CACHES) {
        const currentCache = CURRENT_CACHES[index];

        if(currentCache.contentTypeMatch 
            && !response.headers.get('content-type').match(currentCache.contentTypeMatch)) {
            continue;
        }

        if(currentCache.urlMatch && !request.url.match(currentCache.urlMatch)) {
            continue;
        }

        console.log('sw - found hit match for cache', currentCache.name, request.url);

        const cache = await openCache(currentCache.name);
        if(!cache) {
            console.log('sw - cannot open cache', currentCache.name);
            continue;
        }

        console.log('sw - storing cache hit', request.url);
        await cache.put(request, response.clone());
    }
};

const evaluateRequest = async (request) => {
    const cacheResponse = await evaluateCaches(request);

    if(cacheResponse) {
        console.log('sw - serving cache response ', request.url);
        return cacheResponse;
    }

    var fetchResponse = null;
    try {
        fetchResponse = await fetch(request.clone());
        console.log('sw - fetched request from remote ', request.url);
    } catch(e) {
        console.error("sw - error in fetch handler:", e);

        throw e;
    }

    if(fetchResponse.status < 400) {
        await storeCacheResponse(request, fetchResponse);
    }
    
    return fetchResponse;
};

self.addEventListener('install', (event) => {
    console.log('sw install');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('sw activate');
    event.waitUntil(clients.claim().then(() => {
        console.log('clients claimed');

        return clearCaches();
    }));
});

self.addEventListener('sync', (event) => {
    console.log('sw sync');
});

self.addEventListener('fetch', (event) => {
    console.log("handling fetch event for", event.request.url);
    event.respondWith(evaluateRequest(event.request));
});
