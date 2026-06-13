const CACHE_NAME = 'babu-cache-v1';

// Lista de arquivos locais que o Service Worker vai salvar para o app rodar sem internet
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './icon-48.png',
  './icon-72.png',
  './icon-192.png',
  './icon-512.png'
];

// Instalação do PWA e armazenamento dos arquivos em cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Babu PWA: Arquivos armazenados para funcionamento offline!');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação do PWA e limpeza de caches antigos se houver atualizações
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Babu PWA: Removendo cache antigo...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepta as requisições: Tenta carregar do cache offline primeiro, se não conseguir, busca na rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
