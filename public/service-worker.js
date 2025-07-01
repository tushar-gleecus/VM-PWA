const CACHE_NAME = 'validation-master-cache-v2';
const OFFLINE_URL = '/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL]))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-history') {
    event.waitUntil(syncPendingHistory());
  }
});

async function syncPendingHistory() {
  const db = await openDB('validation-master-db', 1);
  const tx = db.transaction('history', 'readwrite');
  const store = tx.objectStore('history');
  const entries = await store.getAll();

  const unsynced = entries.filter(entry => !entry.synced);

  for (const entry of unsynced) {
    try {
      // Upload images
      const uploadedURLs = [];
      for (let i = 0; i < entry.files.length; i++) {
        const file = entry.files[i];
        const filePath = `${entry.id}/pic-${i}`;

        const res = await fetch(`https://uisclambrgfshwjuwwyw.supabase.co/storage/v1/object/public/images/${filePath}`, {
          method: 'PUT',
          body: file
        });
        if (!res.ok) throw new Error('Upload failed');

        uploadedURLs.push(res.url);
      }

      // Insert record to Supabase table
      await fetch('https://YOUR_FUNCTION_ENDPOINT/syncEntry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...entry,
          pictures: uploadedURLs,
          synced: true,
        }),
      });

      entry.synced = true;
      await store.put(entry);
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'sync-success', id: entry.id });
        });
      });

    } catch (err) {
      console.error('Sync failed:', err);
    }
  }

  await tx.done;
}
