import { useState } from 'react';
import { addLocalEntry } from '../localStore';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function FormScreen() {
  const [testcase, setTestcase] = useState('Run basic start/stop operations');
  const [teststep, setTeststep] = useState('');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const id = uuidv4();
    const added_on = new Date().toISOString();
    let uploadedURLs = [];
    let synced = navigator.onLine;

    if (navigator.onLine) {
      try {
        const uploadPromises = files.map(async (file, index) => {
          const filePath = `${id}/media-${index}`;
          const { error } = await supabase.storage
            .from('images')
            .upload(filePath, file);
          if (error) throw error;

          return `https://uisclambrgfshwjuwwyw.supabase.co/storage/v1/object/public/images/${filePath}`;
        });

        uploadedURLs = await Promise.all(uploadPromises);

        await supabase.from('history').insert([
          {
            id,
            testcase,
            teststep,
            pictures: uploadedURLs,
            added_on,
            synced: true,
          },
        ]);
      } catch (err) {
        console.error('Upload failed:', err);
        synced = false;
      }
    }

    const entry = {
      id,
      testcase,
      teststep,
      pictures: navigator.onLine ? uploadedURLs : files,
      added_on,
      synced,
    };

    await addLocalEntry(entry);
    setTeststep('');
    setFiles([]);
    navigate('/history');
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="min-h-screen bg-[#f0fdff]">
      <header className="flex items-center justify-between p-4 shadow bg-white">
        <img src={logo} alt="Logo" className="h-8" />
        <button
          onClick={() => navigate('/history')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        >
          History
        </button>
      </header>

      <h1 className="text-center text-2xl font-semibold my-6">Test Steps</h1>

      <main className="flex justify-center">
        <div className="w-full max-w-md p-6 bg-blue-50 shadow rounded">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Test Case</label>
            <select
              value={testcase}
              onChange={(e) => setTestcase(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option>Run basic start/stop operations</option>
              <option>Check the equipment power is ON and stable</option>
              <option>Verify all physical parts are present and undamaged</option>
              <option>Check the display/control panel functionality</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Test Step</label>
            <textarea
              value={teststep}
              onChange={(e) => setTeststep(e.target.value)}
              placeholder="Test Step"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Add Pictures / Videos</label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              capture="environment"
              onChange={(e) => setFiles([...e.target.files])}
              className="mb-2"
            />
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => {
                const url = URL.createObjectURL(file);
                const isVideo = file.type.startsWith('video/');

                return (
                  <div key={index} className="relative">
                    {isVideo ? (
                      <video src={url} controls className="w-20 h-20 border rounded" />
                    ) : (
                      <img src={url} alt={file.name} className="w-20 h-20 object-cover border rounded" />
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-0 right-0 text-red-600 hover:text-red-800 bg-white rounded-full"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}
