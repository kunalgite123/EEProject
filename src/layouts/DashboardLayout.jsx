import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NotificationPopup from '../components/NotificationPopup';
import VoiceCommand from '../components/VoiceCommand';

const DashboardLayout = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [detectedVehicle, setDetectedVehicle] = useState("AMBULANCE");
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  return (
    <div className={`min-h-screen bg-[#0b0c10] text-white flex flex-col font-sans selection:bg-cyan-500/30 transition-all duration-500 ${!darkMode ? 'light-mode-active' : ''}`}>
      <Navbar />
      <NotificationPopup 
        active={showNotification} 
        vehicle={detectedVehicle} 
        onDismiss={() => setShowNotification(false)} 
      />
      
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 ml-20 p-4 md:p-6 overflow-y-auto flex flex-col min-h-[calc(100vh-64px)] transition-all duration-300 custom-scrollbar">
          <Outlet context={{ 
            setShowNotification, setDetectedVehicle,
            darkMode, setDarkMode,
            autoRefresh, setAutoRefresh,
            soundAlerts, setSoundAlerts
          }} />
        </main>
      </div>
      <VoiceCommand onEmergencyTrigger={() => {
        setDetectedVehicle("AMBULANCE (VOICE COMMAND)");
        setShowNotification(true);
      }} />
    </div>
  );
};

export default DashboardLayout;
