import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, MapPin, Flame, Zap, Car, Filter, RefreshCw } from 'lucide-react';
import NodeSelector from '../components/NodeSelector';

const SEVERITY = {
  CRITICAL: { label: 'CRITICAL', color: 'red', bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', dot: 'bg-red-500' },
  HIGH:     { label: 'HIGH',     color: 'orange', bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', dot: 'bg-orange-500' },
  MEDIUM:   { label: 'MEDIUM',  color: 'yellow', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  LOW:      { label: 'LOW',     color: 'cyan',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30',   text: 'text-cyan-400',   dot: 'bg-cyan-400' },
};

const INCIDENT_TYPES = [
  { type: 'Multi-vehicle collision', icon: <Car size={14}/>, sev: 'CRITICAL' },
  { type: 'Signal malfunction', icon: <Zap size={14}/>, sev: 'HIGH' },
  { type: 'Road debris detected', icon: <AlertTriangle size={14}/>, sev: 'MEDIUM' },
  { type: 'Congestion spike', icon: <Flame size={14}/>, sev: 'HIGH' },
  { type: 'Emergency vehicle delay', icon: <ShieldAlert size={14}/>, sev: 'CRITICAL' },
  { type: 'Pedestrian near miss', icon: <AlertTriangle size={14}/>, sev: 'MEDIUM' },
  { type: 'Sensor offline', icon: <Zap size={14}/>, sev: 'LOW' },
  { type: 'Wrong-way driver', icon: <Car size={14}/>, sev: 'CRITICAL' },
];

const ZONES = ['Zone A – North Grid', 'Zone B – South Grid', 'Zone C – Central Hub', 'Zone D – East Corridor', 'Zone E – West Bypass'];

let incidentCounter = 1000;
const makeIncident = () => {
  const t = INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)];
  const now = new Date();
  incidentCounter++;
  return {
    id: `INC-${incidentCounter}`,
    type: t.type,
    icon: t.icon,
    severity: t.sev,
    zone: ZONES[Math.floor(Math.random() * ZONES.length)],
    time: now,
    timeStr: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    status: Math.random() > 0.3 ? 'ACTIVE' : 'RESOLVED',
    responseTime: Math.floor(Math.random() * 120) + 10,
    cameraId: `CAM-${Math.floor(Math.random() * 8) + 1}`,
  };
};

const seedIncidents = () => Array.from({ length: 12 }, makeIncident).map((inc, i) => {
  const t = new Date(Date.now() - i * 75000);
  return { ...inc, time: t, timeStr: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), status: i < 3 ? 'ACTIVE' : 'RESOLVED' };
});

const SeverityBadge = ({ sev }) => {
  const s = SEVERITY[sev];
  return (
    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${s.bg} ${s.border} border ${s.text} flex items-center gap-1`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${sev === 'CRITICAL' ? 'animate-pulse' : ''}`}></span>
      {s.label}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, accent }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    className={`glass-panel p-5 rounded-2xl border border-${accent}-500/20 flex flex-col gap-2 relative overflow-hidden`}
  >
    <div className={`absolute -right-3 -top-3 w-16 h-16 bg-${accent}-500/10 rounded-full blur-2xl`}></div>
    <div className={`p-2 rounded-lg bg-${accent}-500/20 text-${accent}-400 w-fit`}>{icon}</div>
    <div className="text-3xl font-bold font-mono text-white">{value}</div>
    <div className="text-xs font-bold text-gray-400 tracking-widest">{label}</div>
    {sub && <div className="text-[10px] text-gray-500">{sub}</div>}
  </motion.div>
);

const HourBar = ({ hour, count, max }) => {
  const pct = max > 0 ? (count / max) * 100 : 0;
  const color = pct > 70 ? 'bg-red-500' : pct > 40 ? 'bg-orange-400' : 'bg-cyan-400';
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="text-[9px] text-gray-500 font-mono">{count > 0 ? count : ''}</div>
      <div className="w-full flex items-end justify-center h-16">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${Math.max(pct, 4)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`w-3/4 ${color} rounded-t opacity-80`}
          style={{ height: `${Math.max(pct, 4)}%` }}
        />
      </div>
      <div className="text-[9px] text-gray-600 font-mono">{hour}h</div>
    </div>
  );
};

const Incidents = () => {
  const [incidents, setIncidents] = useState(seedIncidents);
  const [filter, setFilter] = useState('ALL');
  const [selectedNode, setSelectedNode] = useState('ALL');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // New incident every ~8s
  useEffect(() => {
    const iv = setInterval(() => {
      setIncidents(prev => [makeIncident(), ...prev.slice(0, 19)]);
      setLastRefresh(new Date());
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  const displayIncidents = incidents.filter(i => selectedNode === 'ALL' ? true : (i.id.charCodeAt(4) % 4) + 1 === parseInt(selectedNode.replace('NODE ', '')));
  const filtered = filter === 'ALL' ? displayIncidents : filter === 'ACTIVE' ? displayIncidents.filter(i => i.status === 'ACTIVE') : displayIncidents.filter(i => i.severity === filter);

  const activeCount = displayIncidents.filter(i => i.status === 'ACTIVE').length;
  const resolvedCount = displayIncidents.filter(i => i.status === 'RESOLVED').length;
  const criticalCount = displayIncidents.filter(i => i.severity === 'CRITICAL').length;
  const avgResponse = displayIncidents.length > 0 ? Math.round(displayIncidents.reduce((s, i) => s + i.responseTime, 0) / displayIncidents.length) : 0;

  // Hourly distribution for bar chart (last 12 hours)
  const hourBuckets = Array.from({ length: 12 }, (_, i) => {
    const h = (new Date().getHours() - 11 + i + 24) % 24;
    return { hour: h, count: Math.floor(Math.random() * 5) + (i === 11 ? activeCount : 0) };
  });
  const maxBucket = Math.max(...hourBuckets.map(b => b.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col h-full gap-6"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <ShieldAlert className="text-red-400" size={28} />
            Incident Command
          </h2>
          <p className="text-gray-400 text-sm mt-1">Real-time urban incident detection, triage, and resolution tracking</p>
        </div>
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <NodeSelector selectedNode={selectedNode} onSelectNode={setSelectedNode} />
          <div className="flex items-center gap-3">
            <div className="glass-panel px-3 py-2 rounded-lg border-red-500/30 flex items-center gap-2">
              <RefreshCw size={12} className="text-gray-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-[10px] text-gray-400 font-mono">LAST SYNC {lastRefresh.toLocaleTimeString()}</span>
            </div>
            {activeCount > 0 && (
              <div className="glass-panel px-3 py-2 rounded-lg border-red-500/60 bg-red-500/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs text-red-400 font-bold font-mono">{activeCount} ACTIVE</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <StatCard icon={<AlertTriangle size={18}/>} label="ACTIVE INCIDENTS" value={activeCount} sub="Requires attention" accent="red" />
        <StatCard icon={<CheckCircle2 size={18}/>} label="RESOLVED TODAY" value={resolvedCount} sub="Cleared by AI routing" accent="green" />
        <StatCard icon={<Flame size={18}/>} label="CRITICAL ALERTS" value={criticalCount} sub="High priority queue" accent="orange" />
        <StatCard icon={<Clock size={18}/>} label="AVG RESPONSE" value={`${avgResponse}s`} sub="From detection to dispatch" accent="purple" />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Feed */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-2xl border-red-500/20 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-300 tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              LIVE INCIDENT FEED
            </h3>
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-gray-500" />
              {['ALL', 'ACTIVE', 'CRITICAL', 'HIGH', 'MEDIUM'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all ${filter === f ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {filtered.map((inc) => (
                <motion.div
                  key={inc.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-xl border transition-all ${
                    inc.status === 'ACTIVE'
                      ? `${SEVERITY[inc.severity].bg} ${SEVERITY[inc.severity].border}`
                      : 'bg-white/3 border-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-1.5 rounded-lg mt-0.5 ${inc.status === 'ACTIVE' ? SEVERITY[inc.severity].bg : 'bg-gray-700/50'}`}>
                        <span className={inc.status === 'ACTIVE' ? SEVERITY[inc.severity].text : 'text-gray-500'}>
                          {inc.icon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white font-mono">{inc.id}</span>
                          <SeverityBadge sev={inc.severity} />
                          {inc.status === 'RESOLVED' && (
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-1">
                              <CheckCircle2 size={10}/> RESOLVED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 mt-0.5">{inc.type}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            <MapPin size={10}/> {inc.zone}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">{inc.cameraId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-gray-500 font-mono">{inc.timeStr}</div>
                      <div className="text-[10px] text-purple-400 font-mono mt-0.5">{inc.responseTime}s resp.</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Hourly chart */}
          <div className="glass-panel p-4 rounded-2xl border-orange-500/20 flex flex-col">
            <h3 className="text-sm font-bold text-gray-300 tracking-widest mb-4">INCIDENTS BY HOUR</h3>
            <div className="flex items-end gap-0.5">
              {hourBuckets.map((b) => (
                <HourBar key={b.hour} hour={b.hour} count={b.count} max={maxBucket} />
              ))}
            </div>
          </div>

          {/* Zone breakdown */}
          <div className="glass-panel p-4 rounded-2xl border-purple-500/20 flex flex-col flex-1">
            <h3 className="text-sm font-bold text-gray-300 tracking-widest mb-4">ZONE HOTSPOTS</h3>
            <div className="flex flex-col gap-3">
              {ZONES.map((zone, i) => {
                const zoneCount = displayIncidents.filter(inc => inc.zone === zone).length;
                const pct = Math.round((zoneCount / Math.max(displayIncidents.length, 1)) * 100);
                const colors = ['red', 'orange', 'yellow', 'cyan', 'purple'];
                const c = colors[i];
                return (
                  <div key={zone} className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-mono">{zone}</span>
                      <span className={`text-[10px] font-bold font-mono text-${c}-400`}>{zoneCount} inc.</span>
                    </div>
                    <div className="w-full bg-gray-800/60 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-1.5 rounded-full bg-${c}-500`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <h4 className="text-[10px] text-gray-500 font-mono mb-3 tracking-widest">SEVERITY BREAKDOWN</h4>
              {Object.entries(SEVERITY).map(([key, s]) => {
                const cnt = displayIncidents.filter(i => i.severity === key).length;
                return (
                  <div key={key} className="flex items-center justify-between py-1">
                    <span className={`text-[10px] font-mono font-bold ${s.text}`}>{s.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-800 rounded-full h-1">
                        <div className={`h-1 rounded-full ${s.dot}`} style={{ width: `${(cnt / Math.max(displayIncidents.length, 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono w-4 text-right">{cnt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Incidents;
