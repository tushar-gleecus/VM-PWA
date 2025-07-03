import React, { useEffect, useState } from 'react';
import { getAllEntries } from '../localStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const HistoryScreen = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await getAllEntries();
    setEntries(data.sort((a, b) => b.id - a.id));
  };

  const getPublicUrl = (path) => {
    const { data } = supabase.storage.from('vm-media').getPublicUrl(path);
    return data.publicUrl;
  };

  const getStatusClass = (status) => {
    if (status === 'Synced') return 'text-green-600 font-semibold';
    if (status === 'Pending') return 'text-orange-500 font-semibold';
    return 'text-gray-700';
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <img
            src="logo.svg"
            alt="Logo"
            className="h-8 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <button className="text-blue-600 underline" onClick={() => navigate('/form')}>
            Back to Form
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 text-center">
          CloudMaster365 for Dynamics365 F&O
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-3 border">Test Case</th>
                <th className="p-3 border">Test Step</th>
                <th className="p-3 border">Media</th>
                <th className="p-3 border">Added On</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.flatMap((entry) => {
                const mediaList = [
                  ...(entry.imageFiles || []).map((m) => ({ type: 'image', src: m })),
                  ...(entry.videoFiles || []).map((m) => ({ type: 'video', src: m })),
                ];

                if (mediaList.length === 0) {
                  return (
                    <tr key={entry.id} className="text-center">
                      <td className="p-2 border">{entry.testcase}</td>
                      <td className="p-2 border">{entry.teststep}</td>
                      <td className="p-2 border text-gray-500">No media</td>
                      <td className="p-2 border">{new Date(entry.createdAt).toLocaleString()}</td>
                      <td className={`p-2 border ${getStatusClass(entry.status)}`}>
                        {entry.status}
                      </td>
                    </tr>
                  );
                }

                return mediaList.map((media, idx) => (
                  <tr key={`${entry.id}-${idx}`} className="text-center">
                    <td className="p-2 border">{entry.testcase}</td>
                    <td className="p-2 border">{entry.teststep}</td>
                    <td className="p-2 border">
                      {media.type === 'image' ? (
                        <img
                          src={typeof media.src === 'string' ? getPublicUrl(media.src) : URL.createObjectURL(media.src)}
                          alt="preview"
                          className="h-12 mx-auto"
                        />
                      ) : (
                        <video
                          src={typeof media.src === 'string' ? getPublicUrl(media.src) : URL.createObjectURL(media.src)}
                          controls
                          className="h-12 mx-auto"
                        />
                      )}
                    </td>
                    <td className="p-2 border">{new Date(entry.createdAt).toLocaleString()}</td>
                    <td className={`p-2 border ${getStatusClass(entry.status)}`}>
                      {entry.status}
                    </td>
                  </tr>
                ));
              })}

              {entries.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-black text-white font-semibold px-5 py-2 rounded border-4 border-blue-500">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;
