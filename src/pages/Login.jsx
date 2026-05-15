import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Cpu, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden font-sans text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#050505] to-[#050505]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-0"></div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="glass-panel p-8 rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden group">
          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 opacity-50 blur-[2px] animate-[scan_3s_ease-in-out_infinite]"></div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Shield size={32} className="text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-widest text-white">SYS_ADMIN</h1>
            <p className="text-cyan-500/70 text-xs font-mono mt-2 tracking-[0.2em]">RESTRICTED ACCESS AREA</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
                  placeholder="USERNAME"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
                  placeholder="PASSWORD"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded py-2 px-3 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <p className="text-xs text-red-400 font-mono tracking-wider">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-lg p-[1px]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
              <div className="relative bg-black px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-opacity-0">
                {isLoading ? (
                  <>
                    <Cpu size={18} className="text-cyan-400 animate-spin" />
                    <span className="text-sm font-bold tracking-widest text-cyan-50 font-mono">AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-bold tracking-widest text-white group-hover:text-white transition-colors">INITIALIZE LINK</span>
                    <ChevronRight size={18} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-4">
            <p className="text-[11px] text-cyan-400/70 font-mono mb-2">DEMO CREDENTIALS: admin / admin</p>
            <p className="text-[10px] text-gray-500 font-mono">NODE: TX-7482 | IP: 192.168.1.104</p>
            <p className="text-[10px] text-gray-600 font-mono mt-1">UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED</p>
          </div>
        </div>
      </motion.div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Login;
