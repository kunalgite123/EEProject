import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Cameras from './pages/Cameras';
import Analytics from './pages/Analytics';
import Vehicles from './pages/Vehicles';
import V2X from './pages/V2X';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="cameras" element={<Cameras />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="v2x" element={<V2X />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatBot />
    </Router>
  );
}

export default App;
