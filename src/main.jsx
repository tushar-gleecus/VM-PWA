import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { getAllEntries, updateEntry } from './localStore';
import { supabase } from './supabaseClient';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => console.log('✅ Service Worker registered'))
      .catch((err) => console.error('❌ SW registration failed:', err));
  });
}

// --- Sync Pending Entries ---
async function syncPendingEntries() {
  const entries = await getAllEntries();
  const pending = entries.filter((e) => e.status === 'Pending');

  for (const entry of pending) {
    try {
      const uploadMedia = async (files) => {
        const uploaded = [];
        for (const file of files) {
          const filePath = `${Date.now()}-${file.name}`;
          const { error } = await supabase.storage.from('vm-media').upload(filePath, file);
          if (error) throw error;
          uploaded.push(filePath);
        }
        return uploaded;
      };

      const uploadedImages = await uploadMedia(entry.imageFiles || []);
      const uploadedVideos = await uploadMedia(entry.videoFiles || []);

      await updateEntry(entry.id, {
        imageFiles: uploadedImages,
        videoFiles: uploadedVideos,
        status: 'Synced',
      });

      // 🔄 Notify HistoryScreen to update without reload
      window.dispatchEvent(new CustomEvent('sync-updated'));
    } catch (err) {
      console.error(`❌ Failed to sync entry #${entry.id}:`, err.message);
    }
  }
}

window.addEventListener('online', () => {
  console.log('🟢 Online — syncing pending entries...');
  syncPendingEntries();
});

if (navigator.onLine) {
  syncPendingEntries();
}
