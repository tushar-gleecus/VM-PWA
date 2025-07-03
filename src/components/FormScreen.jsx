import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { addLocalEntry } from '../localStore';
import cameraIcon from '../assets/camera.svg';
import videoIcon from '../assets/video.svg';
import micIcon from '../assets/microphone.svg';

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

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('selectedCardTitle');
    if (saved) setTestcase(saved);
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files || []);
    setVideoFiles(prev => [...prev, ...files]);
  };

  const openCamera = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const files = Array.from(e.target.files || []);
      if (type === 'image') {
        setImageFiles(prev => [...prev, ...files]);
      } else {
        setVideoFiles(prev => [...prev, ...files]);
      }
    };
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
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col justify-between h-full min-h-[90vh]">
        <div>
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
          <textarea
            value={teststep}
            onChange={(e) => setTeststep(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
          <div className="flex justify-end mt-1 mb-4">
            <button
              type="button"
              onClick={startRecognition}
              className="flex items-center gap-1 text-gray-600 text-sm hover:text-black"
            >
              <img src={micIcon} alt="Mic" className="w-4 h-4" />
              Voice Input
            </button>
          </div>

          {/* Upload Pictures */}
          <label className="block text-sm font-medium">Upload Pictures</label>
          <div className="flex flex-wrap gap-2 items-center mt-1">
            <button
              className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              onClick={() => imageInputRef.current?.click()}
            >
              📁 <span className="text-sm">Choose from Gallery</span>
            </button>
            <button
              className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              onClick={() => openCamera('image')}
            >
              <img src={cameraIcon} alt="camera" className="w-5 h-5" />
              <span className="text-sm">Capture Photo</span>
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          {imageFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(file)} alt="preview" className="h-20 w-20 object-cover rounded" />
                  <button
                    onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== index))}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Videos */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Upload Videos</label>
            <div className="flex flex-wrap gap-2 items-center mt-1">
              <button
                className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                onClick={() => videoInputRef.current?.click()}
              >
                📁 <span className="text-sm">Choose from Gallery</span>
              </button>
              <button
                className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                onClick={() => openCamera('video')}
              >
                <img src={videoIcon} alt="video" className="w-5 h-5" />
                <span className="text-sm">Record Video</span>
              </button>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                className="hidden"
              />
            </div>
            {videoFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {videoFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <video src={URL.createObjectURL(file)} controls className="h-20 w-28 rounded" />
                    <button
                      onClick={() => setVideoFiles(videoFiles.filter((_, i) => i !== index))}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
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
