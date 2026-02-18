const CACHE_NAME = 'focus-timer-v1';
const ASSETS = [
  './',
  './index.html',
  './icon.png',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Chivo+Mono:wght@700&display=swap',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/tone@14.7.58/build/Tone.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js'
];

// インストール時にキャッシュを作成
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS);
      })
  );
});

// リクエスト時にキャッシュからレスポンスを返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークに取りに行く
        return fetch(event.request);
      })
  );
});

// 新しいService Workerが有効になった時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
