import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ThreatExplanationData, SAMPLE_EXPLANATIONS } from './ExplainabilityPanel';

interface ConfidenceDonutProps {
  stats?: {
    high: number;
    medium: number;
    low: number;
  };
  onSelectThreat?: (threat: ThreatExplanationData) => void;
}

export const ConfidenceDonut: React.FC<ConfidenceDonutProps> = ({
  stats = { high: 84, medium: 42, low: 18 },
  onSelectThreat
}) => {
  const data = {
    labels: ['High (>80%)', 'Medium (50-80%)', 'Low (<50%)'],
    datasets: [{
      data: [stats.high, stats.medium, stats.low],
      backgroundColor: ['#00E5FF', '#FFA726', '#64748B'],
      borderColor: '#0B1020',
      borderWidth: 3,
      hoverOffset: 6
    }]
  };

  const options = {
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#E2E8F0',
          font: { size: 11, family: "'JetBrains Mono', monospace" }
        }
      }
    },
    maintainAspectRatio: false
  };

  const total = stats.high + stats.medium + stats.low;
  const highPercent = Math.round((stats.high / total) * 100);

  return (
    <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 bg-[#0B1020]/90 flex flex-col justify-between font-mono select-none">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          6. THREAT CONFIDENCE DISTRIBUTION
        </h4>
        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
          EXPLAINABLE AI
        </span>
      </div>

      <div className="relative h-56 w-full flex items-center justify-center">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-2xl font-bold text-cyan-400 text-glow-cyan">{highPercent}%</span>
          <span className="text-[10px] text-gray-400 uppercase">HIGH FIDELITY</span>
        </div>
      </div>

      <div className="mt-2 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
        <button 
          onClick={() => onSelectThreat && onSelectThreat(SAMPLE_EXPLANATIONS['dns-tunnel'])}
          className="p-2 rounded bg-black/30 border border-cyan-500/20 hover:border-cyan-400 transition"
        >
          <div className="text-[10px] text-gray-400">HIGH CONF</div>
          <div className="text-cyan-300 font-bold mt-0.5">{stats.high}</div>
        </button>
        <button 
          onClick={() => onSelectThreat && onSelectThreat(SAMPLE_EXPLANATIONS['c2-beacon'])}
          className="p-2 rounded bg-black/30 border border-orange-500/20 hover:border-orange-400 transition"
        >
          <div className="text-[10px] text-gray-400">MED CONF</div>
          <div className="text-orange-400 font-bold mt-0.5">{stats.medium}</div>
        </button>
        <button 
          onClick={() => onSelectThreat && onSelectThreat(SAMPLE_EXPLANATIONS['port-scan'])}
          className="p-2 rounded bg-black/30 border border-white/10 hover:border-white/30 transition"
        >
          <div className="text-[10px] text-gray-400">LOW / SUSP</div>
          <div className="text-gray-400 font-bold mt-0.5">{stats.low}</div>
        </button>
      </div>
    </div>
  );
};

export default ConfidenceDonut;
