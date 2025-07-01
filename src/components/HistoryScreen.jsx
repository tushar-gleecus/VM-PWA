import { useEffect, useState } from 'react';
import { getAllEntries, updateEntry } from '../localStore';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function HistoryScreen() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const syncOfflineData = async () => {
      const all = await getAllEntries();

      const syncedEntries = await Promise.all(
        all.map(async (entry) => {
          if (!entry.synced && navigator.onLine) {
            try {
              const uploadPromises = entry.pictures.map(async (pic, index) => {
                const blob = await fetch(pic).then((r) => r.blob());
                const filePath = `${entry.id}/pic-${index}`;
                const { error } = await supabase.storage.from('images').upload(filePath, blob);
                if (error) throw error;
                return `https://uisclambrgfshwjuwwyw.supabase.co/storage/v1/object/public/images/${filePath}`;
              });
              const uploadedURLs = await Promise.all(uploadPromises);

              await supabase.from('history').insert([{
                id: entry.id,
                testcase: entry.testcase,
                teststep: entry.teststep,
                pictures: uploadedURLs,
                added_on: entry.added_on,
                synced: true
              }]);

              await updateEntry({ ...entry, synced: true });
              return { ...entry, pictures: uploadedURLs, synced: true };
            } catch (err) {
              console.error('Sync failed', err);
              return entry;
            }
          }
          return entry;
        })
      );

      setEntries(syncedEntries.sort((a, b) => new Date(b.added_on) - new Date(a.added_on)));
    };

    syncOfflineData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0fcff]">
      <header className="flex items-center justify-between p-4 shadow bg-white">
        <img src={logo} alt="Logo" className="h-8" />
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go back
        </button>
      </header>

      <h1 className="text-2xl font-semibold text-center mt-6 text-gray-800">Test Steps</h1>

      <main className="flex justify-center mt-4">
        <div className="w-full max-w-4xl bg-white p-6 rounded shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Testcase</th>
                <th className="p-2 border">Teststep</th>
                <th className="p-2 border">Pictures</th>
                <th className="p-2 border">Added on</th>
                <th className="p-2 border">Sync Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">No entries yet.</td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="p-2 border">{entry.testcase}</td>
                    <td className="p-2 border">{entry.teststep}</td>
                    <td className="p-2 border">
                      <div className="flex gap-2">
                        {entry.pictures.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`img-${index}`}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-2 border">
                      {new Date(entry.added_on).toLocaleString()}
                    </td>
                    <td className={`p-2 border ${entry.synced ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.synced ? 'Synced' : 'Pending'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
