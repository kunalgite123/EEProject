import { motion } from 'framer-motion';
import { User, Mail, Briefcase, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { logout } = useAuth();
  
  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">User Profile</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your account information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col items-center text-center lg:col-span-1">
          <div className="w-32 h-32 rounded-full border-4 border-cyan-500/50 flex items-center justify-center bg-gray-800 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)] overflow-hidden">
            <User size={64} className="text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">System Admin</h3>
          <p className="text-cyan-400 font-mono text-sm mt-1">Access Level: Maximum</p>
          
          <div className="w-full mt-6 flex flex-col gap-3 text-left">
            <div className="flex items-center gap-3 text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
              <Mail size={18} className="text-gray-400" />
              <span>admin@trafficnexus.ai</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
              <Briefcase size={18} className="text-gray-400" />
              <span>Traffic Control Dept</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
              <MapPin size={18} className="text-gray-400" />
              <span>City Command Center</span>
            </div>
          </div>
          
          <button onClick={logout} className="w-full mt-6 py-2.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 rounded-lg transition-colors flex justify-center items-center gap-2 font-bold tracking-wider hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <LogOut size={18} /> LOG OUT
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl border border-cyan-500/30 lg:col-span-2">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-3">Recent Activity</h3>
          
          <div className="flex flex-col gap-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-cyan-500/50 before:to-transparent">
            {[
              { title: 'Logged In', time: 'Today, 08:30 AM', detail: 'Authenticated from Command Center terminal' },
              { title: 'Emergency Protocol Initiated', time: 'Yesterday, 14:45 PM', detail: 'EVPS triggered manually for Ambulance unit A-142' },
              { title: 'System Configuration Updated', time: 'Yesterday, 10:15 AM', detail: 'Adjusted traffic light intervals for Sector 4 analytics' },
              { title: 'AI Model Toggled', time: 'Yesterday, 09:00 AM', detail: 'Switched object detection algorithm to High Accuracy' }
            ].map((act, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-cyan-500/50 bg-gray-900 group-[.is-active]:bg-cyan-900/50 text-slate-500 group-[.is-active]:text-cyan-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(6,182,212,0.5)] z-10">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-cyan-500/30 bg-gray-800/50 shadow-sm hover:border-cyan-500/70 transition-colors">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-white">{act.title}</div>
                    <time className="font-mono text-xs text-cyan-400">{act.time}</time>
                  </div>
                  <div className="text-sm text-gray-400">{act.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
