import { useEffect, useState } from 'react';
import { getAllEntries, updateEntry, clearAllEntries } from '../localStore';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function HistoryScreen() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  const fetchEntries = async () => {
    const data = await getAllEntries();
    setEntries(data.sort((a, b) => new Date(b.added_on) - new Date(a.added_on)));
  };

  const syncPendingEntries = async () => {
    const local = await getAllEntries();
    const pending = local.filter((e) => !e.synced);

    for (const entry of pending) {
      try {
        const uploadedURLs = await Promise.all(
          entry.pictures.map(async (file, index) => {
            const filePath = `${entry.id}/media-${index}`;
            const { error } = await supabase.storage.from('images').upload(filePath, file);
            if (error) throw error;
            return `https://uisclambrgfshwjuwwyw.supabase.co/storage/v1/object/public/images/${filePath}`;
          })
        );

        await supabase.from('history').insert({
          id: entry.id,
          testcase: entry.testcase,
          teststep: entry.teststep,
          pictures: uploadedURLs,
          added_on: entry.added_on,
          synced: true,
        });

        await updateEntry(entry.id, { synced: true, pictures: uploadedURLs });
      } catch (e) {
        console.error('Failed syncing entry:', e);
      }
    }

    fetchEntries();
  };

  const clearHistory = async () => {
    if (confirm('Are you sure you want to delete all history?')) {
      if (navigator.onLine) {
        const { error } = await supabase.from('history').delete().neq('id', '');
        if (error) console.error('Supabase delete failed:', error.message);
      }
      await clearAllEntries();
      fetchEntries();
    }
  };

  useEffect(() => {
    fetchEntries();
    if (navigator.onLine) syncPendingEntries();
    window.addEventListener('online', syncPendingEntries);
    return () => window.removeEventListener('online', syncPendingEntries);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0fdff]">
      <header className="flex items-center justify-between p-4 shadow bg-white">
        <img src={logo} alt="Logo" className="h-8" />
        <div className="flex gap-2">
          <button
            onClick={clearHistory}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Clear History
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
          >
            Go back
          </button>
        </div>
      </header>

      <h1 className="text-center text-2xl font-semibold my-6">Test Steps</h1>

      <main className="flex justify-center">
        <div className="w-full max-w-4xl p-4 bg-blue-50 shadow rounded">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="p-2 font-bold">Testcase</th>
                <th className="p-2 font-bold">Teststep</th>
                <th className="p-2 font-bold">Pictures</th>
                <th className="p-2 font-bold">Added on</th>
                <th className="p-2 font-bold">Sync Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t">
                  <td className="p-2">{entry.testcase}</td>
                  <td className="p-2">{entry.teststep}</td>
                  <td className="p-2 flex gap-2 flex-wrap">
                    {entry.pictures.map((media, index) => {
                      const isVideo = typeof media === 'string' && media.includes('.mp4');
                      return isVideo ? (
                        <video key={index} src={media} controls className="w-16 h-16" />
                      ) : (
                        <img key={index} src={media} alt="thumb" className="w-16 h-16 object-cover" />
                      );
                    })}
                  </td>
                  <td className="p-2">{new Date(entry.added_on).toLocaleString()}</td>
                  <td className="p-2 font-semibold" style={{ color: entry.synced ? 'green' : 'red' }}>
                    {entry.synced ? 'Synced' : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
