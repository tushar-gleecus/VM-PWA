import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { addLocalEntry } from '../localStore';

const testCaseOptions = [
  'Dynamics 365 Dashboard Monitor-2023',
  'Verify: Create BOM',
  'Module Workflow Creation-2023',
  'Verify: Dynamics 365 Dashboard Check',
  'Verify: Action Search',
  'Verify: Dynamics 365 Search Result Export',
  'CleanRoom Monitor Check',
  'Verify: Sales Agreement Fulfillment'
];

const FormScreen = () => {
  const navigate = useNavigate();
  const [testcase, setTestcase] = useState('');
  const [teststep, setTeststep] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('selectedCardTitle');
    if (saved) setTestcase(saved);
  }, []);

  const handleImageChange = (e) => setImageFiles([...e.target.files]);
  const handleVideoChange = (e) => setVideoFiles([...e.target.files]);

  const openCamera = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    input.capture = 'environment';
    input.onchange = type === 'image' ? handleImageChange : handleVideoChange;
    input.click();
  };

  const uploadMedia = async (files) => {
    const uploadedURLs = [];
    for (const file of files) {
      const filePath = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('vm-media').upload(filePath, file);
      if (error) throw error;
      uploadedURLs.push(filePath);
    }
    return uploadedURLs;
  };

  const handleSubmit = async () => {
    const isOnline = navigator.onLine;
    const submission = {
      id: Date.now(),
      testcase,
      teststep,
      imageFiles: [],
      videoFiles: [],
      createdAt: new Date().toISOString(),
      status: isOnline ? 'Synced' : 'Pending',
    };

    if (isOnline) {
      try {
        submission.imageFiles = await uploadMedia(imageFiles);
        submission.videoFiles = await uploadMedia(videoFiles);
      } catch (e) {
        console.error('Upload failed:', e.message);
        submission.status = 'Pending';
      }
    } else {
      submission.imageFiles = imageFiles;
      submission.videoFiles = videoFiles;
    }

    await addLocalEntry(submission);
    navigate('/history');
  };

  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported.');
      return;
    }
    const recog = new window.webkitSpeechRecognition();
    recog.lang = 'en-US';
    recog.continuous = false;
    recog.interimResults = false;

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTeststep((prev) => prev + ' ' + transcript);
    };

    recog.onerror = (e) => console.error('Speech error', e);
    recog.start();
    setRecognition(recog);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <img src="/logo.svg" alt="Logo" className="h-8 cursor-pointer" onClick={() => navigate('/')} />
          <button className="text-sm text-blue-600 hover:underline" onClick={() => navigate('/history')}>
            View History
          </button>
        </div>

        <h2 className="text-lg font-semibold text-center mb-4">
          CloudMaster365 for Dynamics365 F&O
        </h2>

        <label className="block text-sm font-medium">Test Case</label>
        <select
          value={testcase}
          onChange={(e) => setTestcase(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          {[testcase, ...testCaseOptions.filter((opt) => opt !== testcase)].map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </select>

        <label className="block text-sm font-medium">Test Step</label>
        <div className="relative">
          <textarea
            value={teststep}
            onChange={(e) => setTeststep(e.target.value)}
            className="w-full p-2 border rounded pr-10"
          />
          <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={startRecognition}>
            🎤
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Upload Pictures</label>
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            <button onClick={() => openCamera('image')}>📷</button>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Upload Videos</label>
          <div className="flex items-center gap-2">
            <input type="file" accept="video/*" multiple onChange={handleVideoChange} />
            <button onClick={() => openCamera('video')}>🎥</button>
          </div>
        </div>

        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormScreen;
