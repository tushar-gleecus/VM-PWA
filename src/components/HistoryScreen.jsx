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

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <button className="text-blue-600 underline" onClick={() => navigate('/form')}>
            Back to Form
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 text-center">CloudMaster365 for Dynamics365 F&O</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2 border">Test Case</th>
                <th className="p-2 border">Test Step</th>
                <th className="p-2 border">Pictures</th>
                <th className="p-2 border">Videos</th>
                <th className="p-2 border">Added On</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="text-center">
                  <td className="p-2 border">{entry.testcase}</td>
                  <td className="p-2 border">{entry.teststep}</td>
                  <td className="p-2 border">
                    {entry.imageFiles?.map((img, i) => (
                      <img
                        key={i}
                        src={typeof img === 'string' ? getPublicUrl(img) : URL.createObjectURL(img)}
                        alt="thumb"
                        className="h-12 mx-auto"
                      />
                    ))}
                  </td>
                  <td className="p-2 border">
                    {entry.videoFiles?.map((vid, i) => (
                      <video
                        key={i}
                        src={typeof vid === 'string' ? getPublicUrl(vid) : URL.createObjectURL(vid)}
                        controls
                        className="h-12 mx-auto"
                      />
                    ))}
                  </td>
                  <td className="p-2 border">{new Date(entry.createdAt).toLocaleString()}</td>
                  <td className="p-2 border">
                    <span className={entry.status === 'Synced' ? 'text-green-600' : 'text-orange-500'}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">No submissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;
