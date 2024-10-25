//      Caching Assets
//  Versions
const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v2';

//  Assets
const assets = [
    '/',
    '/index.html',

    '/pages/me.html',
    '/pages/notes.html',
    '/pages/scans.html',
    '/pages/archive.html',
    '/pages/help.html',
    '/pages/fallback.html',

    '/js/index.js',
    '/js/notes.js',
    '/js/scans.js',
    '/js/me.js',
    '/js/archive.js',
    '/js/swreg.js',
    '/js/materialize.min.js',

    'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/2.1.4/tesseract.min.js',

    '/css/index.css',
    '/css/notes.css',
    '/css/scans.css',
    '/css/me.css',
    '/css/archive.css',

    '/css/materialize.min.css',

    '/cit_sworker.js',
    '/img/Cit_Logo.png',
    '/img/offlinePic.png'


];

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
};

// install event
self.addEventListener('install', evt => {
    //console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    //console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch events
self.addEventListener('fetch', evt => {
    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        // check cached items size
                        limitCacheSize(dynamicCacheName, 15);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html');
                }
            })
        );
    }
});