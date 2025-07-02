import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import FormScreen from './components/FormScreen';
import HistoryScreen from './components/HistoryScreen';

function App() {
  return (
    <Router>
      <Routes>
        {/* 👇 This makes HomeScreen the default route */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/form" element={<FormScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
