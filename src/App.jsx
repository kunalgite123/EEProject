import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Cameras from './pages/Cameras';
import Analytics from './pages/Analytics';
import Vehicles from './pages/Vehicles';
import V2X from './pages/V2X';
import Incidents from './pages/Incidents';
import AIModels from './pages/AIModels';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import ChatBot from './components/ChatBot';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#0b0c10] text-cyan-400 flex items-center justify-center font-mono">LOADING SYSTEM...</div>;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="cameras" element={<Cameras />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="v2x" element={<V2X />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="ai-models" element={<AIModels />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatBot />
      </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
