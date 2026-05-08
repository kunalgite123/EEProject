import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

const NotificationPopup = ({ active, vehicle, onDismiss }) => {
  // Auto dismiss after 8 seconds
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [active, onDismiss]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-24 left-1/2 z-[5000] w-full max-w-md pointer-events-auto"
        >
          <div className="glass-panel p-4 rounded-xl border-2 border-red-500/80 bg-red-950/40 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-start gap-4">
            <div className="p-3 bg-red-500/20 rounded-full animate-pulse border border-red-500/50">
              <AlertTriangle className="text-red-500" size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-red-400 font-bold text-lg mb-1 tracking-wider uppercase font-mono">
                {vehicle} DETECTED
              </h3>
              <p className="text-gray-200 text-sm">
                AI has identified an active emergency vehicle. 
                All traffic signals on route are being cleared automatically.
              </p>
            </div>
            <button onClick={onDismiss} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
