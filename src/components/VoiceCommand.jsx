import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceCommand = ({ onEmergencyTrigger }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();

  const processCommand = useCallback((text) => {
    const command = text.toLowerCase();
    let matched = true;

    if (command.includes('analytics') || command.includes('data')) {
      navigate('/analytics');
    } else if (command.includes('cameras') || command.includes('video')) {
      navigate('/cameras');
    } else if (command.includes('map') || command.includes('dashboard')) {
      navigate('/');
    } else if (command.includes('emergency') || command.includes('override')) {
      if (onEmergencyTrigger) onEmergencyTrigger();
      navigate('/');
    } else if (command.includes('log') || command.includes('audit')) {
      navigate('/audit-logs');
    } else if (command.includes('setting')) {
      navigate('/settings');
    } else {
      matched = false;
    }

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setTranscript('');
    }, 3000);

  }, [navigate, onEmergencyTrigger]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const recognizedText = event.results[current][0].transcript;
      setTranscript(recognizedText);
      processCommand(recognizedText);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening, processCommand]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-4">
        
        <AnimatePresence>
          {showFeedback && transcript && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="glass-panel p-4 rounded-xl border-cyan-500/50 backdrop-blur-xl flex items-center gap-3 max-w-xs shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Command size={18} className="text-cyan-400 animate-pulse" />
              <div>
                <div className="text-[10px] text-cyan-400 font-mono font-bold tracking-wider mb-1">COMMAND RECOGNIZED</div>
                <div className="text-sm text-white capitalize">"{transcript}"</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleListening}
          className={`p-4 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg relative group ${
            isListening 
              ? 'bg-red-500/20 border-2 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
              : 'bg-gray-900/80 border border-gray-700 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400 backdrop-blur-md'
          }`}
          title="Voice Command Center"
        >
          {isListening ? (
            <>
              <div className="absolute inset-0 rounded-full animate-ping bg-red-500/30"></div>
              <Mic size={24} className="relative z-10 animate-pulse" />
            </>
          ) : (
            <MicOff size={24} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </>
  );
};

export default VoiceCommand;
