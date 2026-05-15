import { motion } from 'framer-motion';

const NodeSelector = ({ selectedNode, onSelectNode }) => {
  const nodes = ['ALL', 'NODE 1', 'NODE 2', 'NODE 3', 'NODE 4'];
  return (
    <div className="flex bg-gray-900/50 p-1 rounded-lg border border-cyan-500/30 overflow-x-auto custom-scrollbar shadow-inner w-full sm:w-auto">
      {nodes.map(node => (
        <button
          key={node}
          onClick={() => onSelectNode(node)}
          className={`relative px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all whitespace-nowrap outline-none ${selectedNode === node ? 'text-[#0b0c10]' : 'text-gray-400 hover:text-cyan-300'}`}
        >
          {selectedNode === node && (
            <motion.div
              layoutId="active-node-pill"
              className="absolute inset-0 bg-cyan-400 rounded-md shadow-[0_0_10px_rgba(69,243,255,0.5)]"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{node}</span>
        </button>
      ))}
    </div>
  );
};

export default NodeSelector;
