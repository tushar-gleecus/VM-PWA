import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();

  const cloudOptions = [
    "CloudMaster 365 for BPA Solutions",
    "CloudMaster for Thermo Fisher LIMS",
    "CloudMaster365 for Dynamics365 F&O"
  ];

  const testCards = [
    { number: 1348, title: "Dynamics 365 Dashboard Monitor-2023", status: "Ready" },
    { number: 1402, title: "Module Workflow Creation-2023", status: "Draft" },
    { number: 1357, title: "Verify: Action Search", status: "Ready to be Tested" },
    { number: 1391, title: "CleanRoom Monitor Check", status: "Approved" },
    { number: 1444, title: "Verify: Create BOM", status: "Verified" },
    { number: 1320, title: "Verify: Dynamics 365 Dashboard Check", status: "Ready" },
    { number: 1385, title: "Verify: Dynamics 365 Search Result Export", status: "Approved" },
    { number: 1366, title: "Verify: Sales Agreement Fulfillment", status: "Ready to be Tested" }
  ];

  const [cloudOption, setCloudOption] = useState("CloudMaster365 for Dynamics365 F&O");
  const [testCaseOption] = useState("Test Case");

  const handleCardClick = (title) => {
    navigate('/form', {
      state: {
        selectedCloud: cloudOption,
        selectedTestCase: title
      }
    });
  };

  const goToHistory = () => {
    navigate('/history', {
      state: { selectedCloud: cloudOption }
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <img src="/logo.png" alt="VM Logo" className="h-8" />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={goToHistory}>
          History
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Welcome back, Dan</h2>

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mb-6">
        <select
          value={cloudOption}
          onChange={(e) => setCloudOption(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {cloudOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <select value={testCaseOption} disabled className="p-2 border border-gray-300 rounded">
          <option>Test Case</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {testCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border rounded p-4 shadow cursor-pointer hover:bg-blue-100"
            onClick={() => handleCardClick(card.title)}
          >
            <h3 className="font-semibold mb-1">Test Case #{card.number}</h3>
            <p className="text-gray-800 mb-1">{card.title}</p>
            <p className="text-sm text-blue-600">{card.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
