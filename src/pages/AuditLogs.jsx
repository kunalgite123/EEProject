import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Filter, ShieldAlert, ShieldCheck, RefreshCw, FileText, Brain } from 'lucide-react';
import axios from 'axios';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiReport, setAiReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/audit-logs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setLogs(res.data.logs);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
    setLoading(false);
  };

  const generateAiReport = async () => {
    setGeneratingReport(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/generate-report', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setAiReport(res.data.report);
    } catch (err) {
      console.error("Failed to generate report", err);
    }
    setGeneratingReport(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionIcon = (action) => {
    if (action.includes('FAILED')) return <ShieldAlert size={16} className="text-red-400" />;
    if (action.includes('SUCCESS')) return <ShieldCheck size={16} className="text-green-400" />;
    return <Database size={16} className="text-cyan-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full gap-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <Database className="text-cyan-400" size={28} />
            System Audit Logs
          </h2>
          <p className="text-gray-400 text-sm mt-1">Immutable trail of administrative actions and system events.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={generateAiReport} 
            disabled={generatingReport}
            className="glass-panel p-2 px-4 rounded-lg border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-colors flex items-center gap-2 text-sm font-bold tracking-widest disabled:opacity-50"
          >
            {generatingReport ? <RefreshCw size={16} className="animate-spin" /> : <Brain size={16} />}
            AI REPORT
          </button>
          <button 
            onClick={fetchLogs} 
            className="glass-panel p-2 rounded-lg border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            title="Refresh Logs"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {aiReport && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-panel p-6 rounded-xl border-purple-500/50 bg-purple-900/10"
        >
          <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold tracking-wider">
            <FileText size={18} />
            <span>LLM INCIDENT SUMMARY</span>
          </div>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {aiReport}
          </div>
          <button 
            onClick={() => setAiReport(null)}
            className="mt-4 text-xs text-purple-400 hover:text-purple-300 underline font-mono"
          >
            DISMISS REPORT
          </button>
        </motion.div>
      )}

      <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 flex-1 flex flex-col min-h-[500px]">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-sm"
              placeholder="Search logs by action, user, or details..."
            />
          </div>
          <button className="bg-gray-800 border border-gray-700 px-4 py-2.5 rounded-lg text-gray-300 flex items-center gap-2 hover:bg-gray-700 transition-colors text-sm font-medium shrink-0">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="flex-1 overflow-auto rounded-lg border border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900/80 text-gray-400 text-xs uppercase tracking-wider sticky top-0 z-10 font-mono">
              <tr>
                <th className="p-4 border-b border-gray-800">Time</th>
                <th className="p-4 border-b border-gray-800">User</th>
                <th className="p-4 border-b border-gray-800">Action</th>
                <th className="p-4 border-b border-gray-800">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 font-mono animate-pulse">Loading secure logs...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 font-mono">No logs matching query.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-gray-400 font-mono text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-white font-mono">{log.user}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="font-mono text-xs tracking-wider text-gray-300">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-xs">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditLogs;
