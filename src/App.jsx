// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormScreen from './components/FormScreen';
import HistoryScreen from './components/HistoryScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
