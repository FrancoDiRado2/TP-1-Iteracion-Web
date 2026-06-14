const CACHE_NAME = 'primarca-game-v1';
// Lista de archivos vitales que se guardarán para uso offline
const ASSETS_TO_CACHE = [
'./',
'./index.html',
'./videojuego3.html',
'./script.js',
'./manifest.json',
'./images/icon-192.png',
'./images/icon-512.png',
'./images/UltraMarine.png',
'./images/spore.png',
'./images/Fondo.png',
'https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js',
'https://labs.phaser.io/assets/sprites/bullet.png'
];

// Instalar el Service Worker y guardar en caché
self.addEventListener('install', event => {
event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
        console.log('[Service Worker] Archivos guardados en caché');
        return cache.addAll(ASSETS_TO_CACHE);
    })
);
self.skipWaiting();
});

// Activar el Service Worker y limpiar cachés viejos
self.addEventListener('activate', event => {
event.waitUntil(
    caches.keys().then(keyList => {
    return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
        console.log('[Service Worker] Borrando caché antiguo', key);
        return caches.delete(key);
        }
    }));
    })
);
self.clients.claim();
});

// Interceptar peticiones (Fetch) - Estrategia: "Network First, falling back to cache"
self.addEventListener('fetch', event => {
event.respondWith(
    fetch(event.request)
    .catch(() => {
        return caches.match(event.request);
    })
);
});