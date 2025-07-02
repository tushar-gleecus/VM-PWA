import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FormScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedCloud = location.state?.selectedCloud || "CloudMaster365 for Dynamics365 F&O";
  const defaultTestCase = location.state?.selectedTestCase || "";

  const testCaseOptions = [
    "Dynamics 365 Dashboard Monitor-2023",
    "Module Workflow Creation-2023",
    "Verify: Action Search",
    "CleanRoom Monitor Check",
    "Verify: Create BOM",
    "Verify: Dynamics 365 Dashboard Check",
    "Verify: Dynamics 365 Search Result Export",
    "Verify: Sales Agreement Fulfillment"
  ];

  const [selectedTestCase, setSelectedTestCase] = useState(defaultTestCase);
  const [testStep, setTestStep] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add submission logic here
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <img src="/logo.png" alt="VM Logo" className="h-8" />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={() => navigate('/history')}>
          History
        </button>
      </div>

      <h2 className="text-lg font-semibold text-center mb-4 max-w-md mx-auto">{selectedCloud}</h2>


      <form onSubmit={handleSubmit} className="bg-white max-w-md mx-auto p-6 rounded shadow">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Test Case</label>
          <select
            value={selectedTestCase}
            onChange={(e) => setSelectedTestCase(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a test case</option>
            {testCaseOptions.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Test Step</label>
          <textarea
            value={testStep}
            onChange={(e) => setTestStep(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
            placeholder="Enter test step"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Add Pictures / Videos</label>
          <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormScreen;
