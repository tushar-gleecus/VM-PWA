import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HistoryScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCloud = location.state?.selectedCloud || "Test Steps";

  const dummyData = [
    { testCase: "Run basic start/stop operations", testStep: "hh", picture: "logo.png", addedOn: "7/2/2025, 12:33:16 PM", status: "Synced" },
    { testCase: "Run basic start/stop operations", testStep: "fhgfh", picture: "react.svg", addedOn: "7/2/2025, 12:33:00 PM", status: "Synced" },
  ];

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <img src="/logo.png" alt="VM Logo" className="h-8" />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={() => navigate('/')}>
          Go back
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-center mb-6">{selectedCloud}</h2>

      <div className="bg-white max-w-5xl mx-auto p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Testcase</th>
              <th className="p-2">Teststep</th>
              <th className="p-2">Pictures</th>
              <th className="p-2">Added on</th>
              <th className="p-2">Sync Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.testCase}</td>
                <td className="p-2">{item.testStep}</td>
                <td className="p-2">
                  <img src={`/${item.picture}`} alt="thumb" className="h-6" />
                </td>
                <td className="p-2">{item.addedOn}</td>
                <td className="p-2 text-green-600">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryScreen;
