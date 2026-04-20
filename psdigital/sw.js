// Nome da versão do cache. Se você atualizar o seu site no futuro, mude para 'v2', 'v3', etc.
const CACHE_NAME = 'mrs-passagem-v1';

// Lista de arquivos que o celular PRECISA baixar para funcionar offline
const ASSETS = [
    './',
    './index.html',
    // IMPORTANTE: Se você baixou os arquivos JS, coloque o nome exato deles aqui embaixo.
    // Exemplo:
    // './jspdf.umd.min.js',
    // './qrcode.min.js',
    // './manifest.json',
    // './icone.png'
];

// 1. INSTALAÇÃO: Salva os arquivos no cache do celular
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Fazendo cache dos arquivos...');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting(); // Força a ativação imediata
});

// 2. ATIVAÇÃO: Limpa caches antigos para não ocupar memória à toa
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Apagando cache antigo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. INTERCEPTAÇÃO: Estratégia "Network First, Fallback to Cache"
// Tenta pegar da internet. Se cair no trecho sem sinal (falhar), puxa do cache offline.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Se tem internet e a requisição deu certo, atualiza o cache com o arquivo novo
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clone);
                });
                return response;
            })
            .catch(() => {
                // Se NÃO tem internet (caiu no catch), busca o arquivo no cache
                return caches.match(event.request);
            })
    );
});
