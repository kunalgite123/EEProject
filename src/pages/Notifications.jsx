import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, type: 'alert', title: 'AMBULANCE DETECTED', desc: 'EVPS triggered at Junction A. Clearing route.', time: '2 min ago', icon: <AlertTriangle size={20} className="text-red-500" /> },
    { id: 2, type: 'info', title: 'System Update', desc: 'AI models updated to version 2.4.1.', time: '1 hour ago', icon: <Info size={20} className="text-cyan-500" /> },
    { id: 3, type: 'success', title: 'Traffic Normalized', desc: 'Congestion cleared at Downtown Bridge.', time: '3 hours ago', icon: <CheckCircle size={20} className="text-green-500" /> },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Notifications</h2>
          <p className="text-gray-400 text-sm mt-1">System alerts and history</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col gap-4 max-w-4xl"
      >
        {notifications.map((notif) => (
          <div key={notif.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 transition-colors">
            <div className={`p-3 rounded-full bg-gray-900 border ${notif.type === 'alert' ? 'border-red-500/50' : notif.type === 'success' ? 'border-green-500/50' : 'border-cyan-500/50'}`}>
              {notif.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold tracking-wide">{notif.title}</h4>
              <p className="text-gray-400 text-sm mt-1">{notif.desc}</p>
            </div>
            <span className="text-xs text-gray-500 font-mono whitespace-nowrap">{notif.time}</span>
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No new notifications
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;
