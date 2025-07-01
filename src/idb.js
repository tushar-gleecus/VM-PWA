import { openDB } from 'idb';

export const dbPromise = openDB('validation-master-db', 1, {
  upgrade(db) {
    db.createObjectStore('history', { keyPath: 'id' });
  },
});

export async function addHistory(entry) {
  const db = await dbPromise;
  await db.put('history', entry);
}

export async function getAllPending() {
  const db = await dbPromise;
  return (await db.getAll('history')).filter(e => !e.synced);
}

export async function markSynced(id) {
  const db = await dbPromise;
  const item = await db.get('history', id);
  if (item) {
    item.synced = true;
    await db.put('history', item);
  }
}

export async function getAllEntries() {
  const db = await dbPromise;
  return await db.getAll('history');
}
