import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState('CloudMaster365 for Dynamics365 F&O');
  const [selectedCategory, setSelectedCategory] = useState('Test Cases');

  const projectOptions = [
    'CloudMaster 365 for BPA Solutions',
    'CloudMaster for Thermo Fisher LIMS',
    'CloudMaster365 for Dynamics365 F&O'
  ];

  const testCaseOptions = [
    'Requirements', 'Releases', 'Documents', 'Test Cases', 'Test Sets', 'Risks', 'Tasks', 'Incidents'
  ];

  const cards = [
    { id: 1348, title: 'Dynamics 365 Dashboard Monitor-2023', status: 'Ready' },
    { id: 1357, title: 'Verify: Action Search', status: 'Ready to be Tested' },
    { id: 1444, title: 'Verify: Create BOM', status: 'Verified' },
    { id: 1385, title: 'Verify: Dynamics 365 Search Result Export', status: 'Approved' },
    { id: 1402, title: 'Module Workflow Creation-2023', status: 'Draft' },
    { id: 1391, title: 'CleanRoom Monitor Check', status: 'Approved' },
    { id: 1320, title: 'Verify: Dynamics 365 Dashboard Check', status: 'Ready' },
    { id: 1366, title: 'Verify: Sales Agreement Fulfillment', status: 'Ready to be Tested' },
  ];

  const handleCardClick = (title) => {
    localStorage.setItem('selectedCardTitle', title);
    localStorage.setItem('selectedProject', selectedProject);
    localStorage.setItem('selectedCategory', selectedCategory);
    navigate('/form');
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <img src={logo} alt="Logo" className="h-10 cursor-pointer" onClick={() => navigate('/')} />
        </div>
        <h2 className="text-lg font-semibold text-center mb-2">Welcome back, Dan</h2>
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-4">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border p-2 rounded w-full sm:w-80"
          >
            {projectOptions.map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded w-full sm:w-60"
          >
            {testCaseOptions.map((tc) => (
              <option key={tc} value={tc}>{tc}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.title)}
              className="cursor-pointer bg-white shadow p-4 rounded hover:bg-gray-50"
            >
              <p className="font-semibold">Test Case #{card.id}</p>
              <p>{card.title}</p>
              <p className="text-sm mt-1" style={{ color: card.status.includes('Ready') ? 'blue' : card.status === 'Approved' ? 'green' : 'purple' }}>{card.status}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-gray-300 text-black px-4 py-2 rounded">Load More</button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
