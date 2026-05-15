import { motion } from 'framer-motion';
import { Save, Sliders, Shield, Database } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const Settings = () => {
  const { 
    darkMode, setDarkMode,
    autoRefresh, setAutoRefresh,
    soundAlerts, setSoundAlerts
  } = useOutletContext();

  const handleBackendAction = async (endpoint, payload = null) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      let res;
      if (payload !== null) {
        res = await axios.post(`http://127.0.0.1:8000/api/${endpoint}`, payload, config);
      } else {
        res = await axios.post(`http://127.0.0.1:8000/api/${endpoint}`, {}, config);
      }
      alert(`Success: ${res.data.message || res.data.status}`);
    } catch (err) {
      alert(`Error: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleGetAction = async (endpoint) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      alert(`Success: \n${JSON.stringify(res.data, null, 2)}`);
    } catch (err) {
      alert(`Error: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleChangePassword = () => {
    const current_password = prompt("Enter current password:");
    if (!current_password) return;
    const new_password = prompt("Enter new password:");
    if (!new_password) return;
    handleBackendAction('change-password', { current_password, new_password });
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Settings</h2>
        <p className="text-gray-400 text-sm mt-1">System configuration and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Sliders className="text-cyan-400" size={24} />
            <h3 className="text-xl font-bold text-white">General</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Dark Mode</span>
              <div 
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${darkMode ? 'bg-cyan-500' : 'bg-gray-600'}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <motion.div 
                  className={`w-4 h-4 rounded-full absolute top-0.5 ${darkMode ? 'bg-white' : 'bg-gray-400'}`}
                  animate={{ left: darkMode ? "1.375rem" : "0.125rem" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Auto Refresh Maps</span>
              <div 
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${autoRefresh ? 'bg-cyan-500' : 'bg-gray-600'}`}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <motion.div 
                  className={`w-4 h-4 rounded-full absolute top-0.5 ${autoRefresh ? 'bg-white' : 'bg-gray-400'}`}
                  animate={{ left: autoRefresh ? "1.375rem" : "0.125rem" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Sound Alerts</span>
              <div 
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${soundAlerts ? 'bg-cyan-500' : 'bg-gray-600'}`}
                onClick={() => setSoundAlerts(!soundAlerts)}
              >
                <motion.div 
                  className={`w-4 h-4 rounded-full absolute top-0.5 ${soundAlerts ? 'bg-white' : 'bg-gray-400'}`}
                  animate={{ left: soundAlerts ? "1.375rem" : "0.125rem" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-cyan-400" size={24} />
            <h3 className="text-xl font-bold text-white">Security</h3>
          </div>
          <div className="flex flex-col gap-4">
            <button onClick={handleChangePassword} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-600 font-medium tracking-wide">Change Password</button>
            <button onClick={() => handleBackendAction('toggle-2fa')} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-600 font-medium tracking-wide">Two-Factor Auth</button>
            <button onClick={() => handleGetAction('active-sessions')} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-600 font-medium tracking-wide">Active Sessions</button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Database className="text-cyan-400" size={24} />
            <h3 className="text-xl font-bold text-white">Data Management</h3>
          </div>
          <div className="flex flex-col gap-4">
            <button onClick={() => handleGetAction('export-logs')} className="w-full py-2 bg-gray-800 hover:bg-cyan-900/50 hover:text-cyan-400 text-white rounded-lg transition-colors border border-gray-600 hover:border-cyan-500/50 font-medium tracking-wide">Export Logs</button>
            <button onClick={() => handleBackendAction('clear-cache')} className="w-full py-2 bg-gray-800 hover:bg-cyan-900/50 hover:text-cyan-400 text-white rounded-lg transition-colors border border-gray-600 hover:border-cyan-500/50 font-medium tracking-wide">Clear Cache</button>
            <button onClick={() => handleBackendAction('reset-analytics')} className="w-full py-2 bg-gray-800 hover:bg-red-900/50 hover:text-red-400 text-white rounded-lg transition-colors border border-gray-600 hover:border-red-500/50 font-medium tracking-wide">Reset Analytics</button>
          </div>
        </motion.div>
      </div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-end mt-4">
        <button className="px-6 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/40 transition-colors flex items-center gap-2 font-bold tracking-wider hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <Save size={18} /> SAVE CHANGES
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;
