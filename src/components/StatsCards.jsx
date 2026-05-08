import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Car, Activity, Zap, Siren, CheckCircle, Clock } from 'lucide-react';

const colorStyles = {
  cyan: {
    bgHover: 'bg-cyan-500',
    bgIcon: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bgBar: 'bg-cyan-500'
  },
  yellow: {
    bgHover: 'bg-yellow-500',
    bgIcon: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    bgBar: 'bg-yellow-500'
  },
  green: {
    bgHover: 'bg-green-500',
    bgIcon: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30',
    bgBar: 'bg-green-500'
  },
  red: {
    bgHover: 'bg-red-500',
    bgIcon: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    bgBar: 'bg-red-500'
  },
  purple: {
    bgHover: 'bg-purple-500',
    bgIcon: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    bgBar: 'bg-purple-500'
  },
  blue: {
    bgHover: 'bg-blue-500',
    bgIcon: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    bgBar: 'bg-blue-500'
  }
};

const AnimatedCounter = ({ value, suffix = "", prefix = "" }) => {
  const spring = useSpring(value, { bounce: 0, duration: 1500 });
  
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  const display = useTransform(spring, (current) => {
    let val = current;
    if (val >= 1000) {
      val = Math.round(val).toLocaleString();
    } else if (Number.isInteger(value)) {
      val = Math.round(val);
    } else {
      val = val.toFixed(1);
    }
    return `${prefix}${val}${suffix}`;
  });

  return <motion.span>{display}</motion.span>;
};

const StatsCard = ({ title, value, icon, color, trend, suffix, prefix, delay }) => {
  const styles = colorStyles[color];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`glass-panel p-4 rounded-2xl relative overflow-hidden group border ${styles.border} hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300`}
      style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)' }}
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${styles.bgHover} blur-2xl group-hover:opacity-30 transition-opacity duration-500`}></div>
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-gray-400 text-xs font-medium mb-1 whitespace-nowrap">{title}</p>
          <h3 className={`text-2xl font-bold text-white font-mono ${color === 'red' && value > 0 ? 'pulse-animation text-red-400' : ''}`}>
            <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl ${styles.bgIcon} ${styles.text} border ${styles.border}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-auto pt-2">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-800 ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-[10px] text-gray-500">vs last hour</span>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800">
        <div className={`h-full ${styles.bgBar}`} style={{ width: `${Math.min(100, Math.max(0, trend > 0 ? 50 + trend : 50))}%` }}></div>
      </div>
      
      {/* Neon border glow effect on hover */}
      <div className={`absolute inset-0 border border-transparent rounded-2xl group-hover:${styles.border} group-hover:shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 pointer-events-none`}></div>
    </motion.div>
  );
};

const StatsCards = () => {
  const [data, setData] = useState({
    vehicles: 24592,
    cleared: 1542,
    emergency: 1,
    timeSaved: 14.5,
    congestion: 68,
    accuracy: 94.2
  });

  // Fake real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        // Randomly decide if emergency active changes
        let newEmergency = prev.emergency;
        if (Math.random() > 0.95) {
          newEmergency = newEmergency === 0 ? 1 : 0;
        }

        return {
          vehicles: prev.vehicles + Math.floor(Math.random() * 8),
          cleared: prev.cleared + Math.floor(Math.random() * 3),
          emergency: newEmergency,
          timeSaved: Number((prev.timeSaved + (Math.random() * 0.2 - 0.1)).toFixed(1)),
          congestion: Math.max(10, Math.min(95, prev.congestion + Math.floor(Math.random() * 5) - 2)),
          accuracy: Number((Math.max(90, Math.min(99.9, prev.accuracy + (Math.random() * 0.2 - 0.1)))).toFixed(1))
        };
      });
    }, 2500); // update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: "Total Vehicles", value: data.vehicles, icon: <Car size={20} />, color: "cyan", trend: 12.5, suffix: "" },
    { title: "Signals Cleared", value: data.cleared, icon: <CheckCircle size={20} />, color: "green", trend: 8.2, suffix: "" },
    { title: "Emergency Active", value: data.emergency, icon: <Siren size={20} />, color: "red", trend: data.emergency > 0 ? 100 : 0, suffix: "" },
    { title: "Avg. Time Saved", value: data.timeSaved, icon: <Clock size={20} />, color: "purple", trend: 4.5, suffix: "m" },
    { title: "Traffic Congestion", value: data.congestion, icon: <Activity size={20} />, color: "yellow", trend: -5.2, suffix: "%" },
    { title: "AI Prediction", value: data.accuracy, icon: <Zap size={20} />, color: "blue", trend: 2.1, suffix: "%" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatsCard 
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          suffix={stat.suffix}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default StatsCards;
