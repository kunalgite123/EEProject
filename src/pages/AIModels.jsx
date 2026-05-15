import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, BrainCircuit, Eye, Zap, Activity, ChevronRight, CheckCircle, BarChart3, Layers } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import NodeSelector from '../components/NodeSelector';

const MODELS = [
  {
    id: 'yolov8-traffic',
    name: 'YOLOv8-Traffic',
    version: 'v2.4.1',
    task: 'Object Detection',
    icon: <Eye size={20} />,
    accent: 'cyan',
    status: 'ACTIVE',
    accuracy: 96.8,
    latency: 4.2,
    fps: 42,
    inferences: '1.24M',
    description: 'Primary vehicle + pedestrian detection model optimised for urban intersections.',
    radarData: [
      { metric: 'Accuracy', val: 97 },
      { metric: 'Speed', val: 88 },
      { metric: 'Recall', val: 95 },
      { metric: 'Precision', val: 96 },
      { metric: 'Robustness', val: 91 },
      { metric: 'Efficiency', val: 85 },
    ],
    classes: ['Car', 'Truck', 'Bus', 'Pedestrian', 'Cyclist', 'Motorbike', 'Emergency'],
  },
  {
    id: 'siren-classifier',
    name: 'SirenNet',
    version: 'v1.2.0',
    task: 'Audio Classification',
    icon: <Activity size={20} />,
    accent: 'red',
    status: 'ACTIVE',
    accuracy: 98.1,
    latency: 1.8,
    fps: null,
    inferences: '87K',
    description: 'CNN-based audio model that detects emergency sirens with sub-2ms latency via spectrogram analysis.',
    radarData: [
      { metric: 'Accuracy', val: 98 },
      { metric: 'Speed', val: 96 },
      { metric: 'Recall', val: 99 },
      { metric: 'Precision', val: 97 },
      { metric: 'Robustness', val: 89 },
      { metric: 'Efficiency', val: 93 },
    ],
    classes: ['Ambulance', 'Fire Engine', 'Police', 'No Siren'],
  },
  {
    id: 'congestion-lstm',
    name: 'CongestionLSTM',
    version: 'v3.1.0',
    task: 'Time-series Prediction',
    icon: <BrainCircuit size={20} />,
    accent: 'purple',
    status: 'ACTIVE',
    accuracy: 93.5,
    latency: 12.4,
    fps: null,
    inferences: '340K',
    description: 'Bidirectional LSTM predicting congestion 15–60 minutes ahead using historical flow, time-of-day, and weather features.',
    radarData: [
      { metric: 'Accuracy', val: 93 },
      { metric: 'Speed', val: 72 },
      { metric: 'Recall', val: 90 },
      { metric: 'Precision', val: 94 },
      { metric: 'Robustness', val: 87 },
      { metric: 'Efficiency', val: 79 },
    ],
    classes: ['Free Flow', 'Mild', 'Moderate', 'Heavy', 'Gridlock'],
  },
  {
    id: 'signal-optimizer',
    name: 'SignalRL',
    version: 'v0.9.5',
    task: 'Reinforcement Learning',
    icon: <Zap size={20} />,
    accent: 'yellow',
    status: 'TRAINING',
    accuracy: 89.2,
    latency: 0.8,
    fps: null,
    inferences: '2.1M',
    description: 'Deep-Q agent that controls traffic signal phases in real time, trained via multi-intersection micro-simulation.',
    radarData: [
      { metric: 'Accuracy', val: 89 },
      { metric: 'Speed', val: 99 },
      { metric: 'Recall', val: 85 },
      { metric: 'Precision', val: 88 },
      { metric: 'Robustness', val: 80 },
      { metric: 'Efficiency', val: 97 },
    ],
    classes: ['Phase A', 'Phase B', 'Phase C', 'Phase D'],
  },
];

const AccentColors = {
  cyan:   { glow: 'rgba(6,182,212,0.25)',  fill: '#06b6d4', bar: 'bg-cyan-400',   border: 'border-cyan-500/30',   text: 'text-cyan-400',   bg: 'bg-cyan-500/15' },
  red:    { glow: 'rgba(239,68,68,0.25)',  fill: '#ef4444', bar: 'bg-red-400',    border: 'border-red-500/30',    text: 'text-red-400',    bg: 'bg-red-500/15'  },
  purple: { glow: 'rgba(139,92,246,0.25)', fill: '#8b5cf6', bar: 'bg-purple-400', border: 'border-purple-500/30', text: 'text-purple-400', bg: 'bg-purple-500/15' },
  yellow: { glow: 'rgba(234,179,8,0.25)',  fill: '#eab308', bar: 'bg-yellow-400', border: 'border-yellow-500/30', text: 'text-yellow-400', bg: 'bg-yellow-500/15' },
};

const GAUGE_R = 38;
const GAUGE_C = 2 * Math.PI * GAUGE_R;
const AccuracyGauge = ({ accuracy, accent }) => {
  const pct = accuracy / 100;
  const stroke = AccentColors[accent].fill;
  return (
    <svg width="100" height="60" viewBox="0 0 100 60" className="overflow-visible">
      <path d="M10 55 A 40 40 0 0 1 90 55" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" strokeLinecap="round" />
      <motion.path
        d="M10 55 A 40 40 0 0 1 90 55"
        fill="none"
        stroke={stroke}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={GAUGE_C * 0.5}
        initial={{ strokeDashoffset: GAUGE_C * 0.5 }}
        animate={{ strokeDashoffset: GAUGE_C * 0.5 * (1 - pct) }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
      />
      <text x="50" y="54" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="monospace">
        {accuracy}%
      </text>
    </svg>
  );
};

const makeInference = (model) => ({
  id: Math.random().toString(36).substr(2, 8),
  model: model.name,
  accent: model.accent,
  label: model.classes[Math.floor(Math.random() * model.classes.length)],
  confidence: (Math.random() * 15 + 84).toFixed(1),
  latency: (Math.random() * 3 + model.latency * 0.8).toFixed(1),
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
});

const seedInferences = () =>
  Array.from({ length: 10 }, () => makeInference(MODELS[Math.floor(Math.random() * MODELS.length)]));

const buildPerfData = () =>
  Array.from({ length: 20 }, (_, i) => ({
    t: i,
    yolo: 40 + (i * 2.1) % 30 + Math.random() * 5,
    siren: 50 + (i * 1.7) % 25 + Math.random() * 4,
    lstm: 35 + (i * 2.3) % 28 + Math.random() * 6,
    rl: 45 + (i * 1.9) % 22 + Math.random() * 5,
  }));

const AIModels = () => {
  const [selected, setSelected] = useState(MODELS[0]);
  const [inferences, setInferences] = useState(seedInferences);
  const [perfData, setPerfData] = useState(buildPerfData);
  const [selectedNode, setSelectedNode] = useState('ALL');

  useEffect(() => {
    const iv = setInterval(() => {
      const m = MODELS[Math.floor(Math.random() * MODELS.length)];
      setInferences(prev => [makeInference(m), ...prev.slice(0, 14)]);
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setPerfData(prev => {
        const n = [...prev.slice(1)];
        n.push({
          t: n[n.length - 1].t + 1,
          yolo: Math.max(10, Math.min(99, prev[prev.length - 1].yolo + (Math.random() * 10 - 5))),
          siren: Math.max(10, Math.min(99, prev[prev.length - 1].siren + (Math.random() * 8 - 4))),
          lstm: Math.max(10, Math.min(99, prev[prev.length - 1].lstm + (Math.random() * 10 - 5))),
          rl: Math.max(10, Math.min(99, prev[prev.length - 1].rl + (Math.random() * 12 - 6))),
        });
        return n;
      });
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const sel = AccentColors[selected.accent];
  const nodeFactor = selectedNode === 'ALL' ? 1 : parseInt(selectedNode.replace('NODE ', '')) * 0.2 + 0.6;
  const displayPerfData = perfData.map(d => ({
    ...d,
    yolo: Math.round(d.yolo * nodeFactor),
    siren: Math.round(d.siren * nodeFactor),
    lstm: Math.round(d.lstm * nodeFactor),
    rl: Math.round(d.rl * nodeFactor),
  }));
  const displayInferences = inferences.map(inf => ({
    ...inf,
    latency: (parseFloat(inf.latency) * (2 - nodeFactor)).toFixed(1)
  }));

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
            <Cpu className="text-purple-400" size={28} />
            AI Model Observatory
          </h2>
          <p className="text-gray-400 text-sm mt-1">Live inference streams, accuracy metrics, and model performance benchmarks</p>
        </div>
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <NodeSelector selectedNode={selectedNode} onSelectNode={setSelectedNode} />
          <div className="glass-panel px-4 py-2 rounded-lg border-purple-500/30 flex items-center gap-3 hidden md:flex">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            <span className="text-xs text-gray-300 font-mono">MLOPS: {MODELS.filter(m => m.status === 'ACTIVE').length} MODELS SERVING</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Model selector + live inferences */}
        <div className="flex flex-col gap-4">
          {/* Model cards */}
          <div className="glass-panel p-3 rounded-2xl border-white/10 flex flex-col gap-2">
            <h3 className="text-[10px] font-bold text-gray-500 tracking-widest px-1 mb-1 flex items-center gap-2">
              <Layers size={12}/> DEPLOYED MODELS
            </h3>
            {MODELS.map(m => {
              const ac = AccentColors[m.accent];
              const isSelected = selected.id === m.id;
              return (
                <motion.button
                  key={m.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(m)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? `${ac.bg} ${ac.border} shadow-[0_0_12px_${ac.glow}]`
                      : 'border-white/5 bg-white/3 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? ac.bg : 'bg-gray-800'}`}>
                        <span className={isSelected ? ac.text : 'text-gray-500'}>{m.icon}</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">{m.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{m.task}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                        m.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>{m.status}</span>
                      <ChevronRight size={14} className={isSelected ? ac.text : 'text-gray-600'} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Live inference stream */}
          <div className="glass-panel p-3 rounded-2xl border-white/10 flex-1 flex flex-col min-h-[220px]">
            <h3 className="text-[10px] font-bold text-gray-500 tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              LIVE INFERENCE STREAM
            </h3>
            <div className="flex-1 flex flex-col gap-1 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#0b0c10]/80 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[#0b0c10]/80 to-transparent z-10 pointer-events-none"></div>
              <AnimatePresence>
                {displayInferences.map((inf) => {
                  const ac = AccentColors[inf.accent];
                  return (
                    <motion.div
                      key={inf.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between text-[10px] font-mono py-0.5 border-b border-white/5"
                    >
                      <span className={`${ac.text} font-bold`}>{inf.model}</span>
                      <span className="text-gray-300">{inf.label}</span>
                      <span className="text-green-400">{inf.confidence}%</span>
                      <span className="text-purple-400">{inf.latency}ms</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Center: Selected model detail */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className={`glass-panel p-5 rounded-2xl ${sel.border} border flex flex-col gap-4`}
              style={{ boxShadow: `0 0 24px ${sel.glow}` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${sel.bg}`}>
                    <span className={sel.text}>{selected.icon}</span>
                  </div>
                  <div>
                    <div className={`text-lg font-bold font-mono ${sel.text}`}>{selected.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{selected.version} · {selected.task}</div>
                  </div>
                </div>
                <AccuracyGauge accuracy={selected.accuracy} accent={selected.accent} />
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">{selected.description}</p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'ACCURACY', value: `${selected.accuracy}%`, color: sel.text },
                  { label: 'LATENCY', value: `${selected.latency}ms`, color: 'text-purple-400' },
                  { label: 'INFERENCES', value: selected.inferences, color: 'text-cyan-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className={`text-base font-bold font-mono ${color}`}>{value}</div>
                    <div className="text-[9px] text-gray-500 tracking-widest mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-[10px] text-gray-500 tracking-widest mb-2 font-mono">OUTPUT CLASSES</div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.classes.map(cls => (
                    <span key={cls} className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${sel.bg} ${sel.border} border ${sel.text} flex items-center gap-1`}>
                      <CheckCircle size={9}/> {cls}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Radar */}
          <div className="glass-panel p-4 rounded-2xl border-white/10 flex-1 flex flex-col">
            <h3 className="text-[10px] font-bold text-gray-500 tracking-widest mb-2 flex items-center gap-2">
              <BarChart3 size={12}/> MODEL PROFILE — {selected.name}
            </h3>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={selected.radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <Radar
                    name={selected.name}
                    dataKey="val"
                    stroke={sel.fill}
                    fill={sel.fill}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: All-model throughput chart */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-4 rounded-2xl border-white/10 flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-[10px] font-bold text-gray-500 tracking-widest mb-1 flex items-center gap-2">
              <Activity size={12}/> REAL-TIME THROUGHPUT (inferences/s)
            </h3>
            <div className="flex items-center gap-4 mb-3 flex-wrap">
              {[
                { key: 'yolo', label: 'YOLOv8', color: '#06b6d4' },
                { key: 'siren', label: 'SirenNet', color: '#ef4444' },
                { key: 'lstm', label: 'LSTM', color: '#8b5cf6' },
                { key: 'rl', label: 'SignalRL', color: '#eab308' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className="w-4 h-0.5 rounded" style={{ background: color }}></div>
                  <span className="text-[10px] text-gray-500 font-mono">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayPerfData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis stroke="#4b5563" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelFormatter={() => ''}
                  />
                  <Line type="monotone" dataKey="yolo" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="siren" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="lstm" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="rl" stroke="#eab308" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'TOTAL MODELS', value: MODELS.length, accent: 'text-white' },
              { label: 'SERVING', value: MODELS.filter(m => m.status === 'ACTIVE').length, accent: 'text-green-400' },
              { label: 'AVG ACCURACY', value: `${(MODELS.reduce((s, m) => s + m.accuracy, 0) / MODELS.length).toFixed(1)}%`, accent: 'text-cyan-400' },
              { label: 'TRAINING', value: MODELS.filter(m => m.status === 'TRAINING').length, accent: 'text-yellow-400' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="glass-panel p-3 rounded-xl border-white/10 text-center">
                <div className={`text-xl font-bold font-mono ${accent}`}>{value}</div>
                <div className="text-[9px] text-gray-500 tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* System health */}
          <div className="glass-panel p-4 rounded-2xl border-white/10">
            <h3 className="text-[10px] font-bold text-gray-500 tracking-widest mb-3 flex items-center gap-2">
              <Cpu size={12}/> INFERENCE CLUSTER HEALTH
            </h3>
            {[
              { label: 'GPU Utilisation', pct: 72, color: 'bg-cyan-400' },
              { label: 'VRAM Usage', pct: 58, color: 'bg-purple-400' },
              { label: 'Model Cache', pct: 44, color: 'bg-green-400' },
              { label: 'Queue Depth', pct: 18, color: 'bg-yellow-400' },
            ].map(({ label, pct, color }) => (
              <div key={label} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-gray-400 font-mono">{label}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{pct}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-1.5 rounded-full ${color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIModels;
