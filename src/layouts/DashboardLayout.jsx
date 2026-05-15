import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NotificationPopup from '../components/NotificationPopup';

const DashboardLayout = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [detectedVehicle, setDetectedVehicle] = useState("AMBULANCE");

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar />
      <NotificationPopup 
        active={showNotification} 
        vehicle={detectedVehicle} 
        onDismiss={() => setShowNotification(false)} 
      />
      
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 ml-20 p-4 md:p-6 overflow-y-auto flex flex-col min-h-[calc(100vh-64px)] transition-all duration-300 custom-scrollbar">
          <Outlet context={{ setShowNotification, setDetectedVehicle }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
