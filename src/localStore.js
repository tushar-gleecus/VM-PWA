import { openDB } from 'idb';

const DB_NAME = 'validationDB';
const STORE_NAME = 'history';

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function addLocalEntry(entry) {
  const db = await getDB();
  await db.put(STORE_NAME, entry);
}

export async function getAllEntries() {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function updateEntry(id, updates) {
  const db = await getDB();
  const entry = await db.get(STORE_NAME, id);
  if (!entry) return;
  const updatedEntry = { ...entry, ...updates };
  await db.put(STORE_NAME, updatedEntry);
}

export const clearAllEntries = async () => {
  const db = await getDb();
  const tx = db.transaction('history', 'readwrite');
  await tx.objectStore('history').clear();
  await tx.done;
};
