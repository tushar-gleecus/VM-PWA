import { openDB } from 'idb';

const DB_NAME = 'submission-db';
const STORE_NAME = 'pending';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { autoIncrement: true });
      }
    }
  });
}

export async function saveToLocalDB(data) {
  const db = await getDB();
  await db.add(STORE_NAME, data);
}

export async function getLocalSubmissions() {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function clearLocalSubmissions() {
  const db = await getDB();
  const keys = await db.getAllKeys(STORE_NAME);
  for (const key of keys) {
    await db.delete(STORE_NAME, key);
  }
}
