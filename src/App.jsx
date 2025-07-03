import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import FormScreen from './components/FormScreen';
import HistoryScreen from './components/HistoryScreen';

function App() {
  useEffect(() => {
    let deferredPrompt;

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      deferredPrompt = e;

      const installBtn = document.getElementById('install-btn');
      if (installBtn) {
        installBtn.style.display = 'block';
        installBtn.onclick = async () => {
          installBtn.style.display = 'none';
          deferredPrompt.prompt();
          const result = await deferredPrompt.userChoice;
          console.log('Install result:', result.outcome);
          deferredPrompt = null;
        };
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/form" element={<FormScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
        </Routes>
      </Router>

      {/* Install button (hidden by default) */}
      <button
        id="install-btn"
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hidden z-50"
      >
        Install App
      </button>
    </>
  );
}

export default App;
