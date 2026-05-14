import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landing';
import DashboardPage from './pages/Dashboard';
import PlatformPage from './pages/Platform';
import AnalyticsPage from './pages/Analytics';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
  );
}

export default App;
