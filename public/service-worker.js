/* eslint-disable no-restricted-globals */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  clients.claim();
});

importScripts('https://cdn.jsdelivr.net/npm/localforage/dist/localforage.min.js');

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-submissions') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  const localSubmissions = await localforage.getItem('offlineSubmissions') || [];
  const stillPending = [];

  for (const submission of localSubmissions) {
    try {
      const uploadedURLs = [];

      for (const file of submission.files || []) {
        const fileName = `${Date.now()}-${file.name}`;
        const res = await fetch(file);
        const blob = await res.blob();

        const formData = new FormData();
        formData.append('file', blob, fileName);

        const uploadRes = await fetch(
          `https://uisclambrgfshwjjuwvy.supabase.co/storage/v1/object/public/images/${fileName}`,
          {
            method: 'PUT',
            headers: {
              apikey: 'your_supabase_api_key',
              Authorization: 'Bearer your_supabase_anon_key',
            },
            body: blob,
          }
        );

        if (!uploadRes.ok) throw new Error('Upload failed');

        uploadedURLs.push(`https://uisclambrgfshwjjuwvy.supabase.co/storage/v1/object/public/images/${fileName}`);
      }

      await fetch('https://uisclambrgfshwjjuwvy.supabase.co/rest/v1/history', {
        method: 'POST',
        headers: {
          apikey: 'your_supabase_api_key',
          Authorization: 'Bearer your_supabase_anon_key',
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          testcase: submission.testcase,
          teststep: submission.teststep,
          pictures: uploadedURLs,
          added_on: submission.added_on,
          synced: true,
        }),
      });
    } catch (err) {
      console.error('[SW] Sync failed:', err);
      stillPending.push(submission);
    }
  }

  await localforage.setItem('offlineSubmissions', stillPending);
}
