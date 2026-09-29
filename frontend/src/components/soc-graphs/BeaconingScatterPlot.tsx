import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Crosshair, Eye } from 'lucide-react';
import { SAMPLE_EXPLANATIONS, ThreatExplanationData } from './ExplainabilityPanel';

interface BeaconingScatterPlotProps {
  onSelectThreat?: (threat: ThreatExplanationData) => void;
  onSelectExplanation?: (data: ThreatExplanationData) => void;
}

export const BeaconingScatterPlot: React.FC<BeaconingScatterPlotProps> = ({ 
  onSelectThreat,
  onSelectExplanation 
}) => {
  const normalPoints = Array.from({ length: 45 }, () => ({
    x: Math.floor(Math.random() * 60),
    y: Math.floor(Math.random() * 260) + 15
  }));

  const botnetPoints = Array.from({ length: 35 }, (_, i) => ({
    x: i * 1.7,
    y: 60 + (Math.random() * 3 - 1.5)
  }));

  const data = {
    datasets: [
      {
        label: 'Automated C2 Beaconing (198.51.100.44)',
        data: botnetPoints,
        backgroundColor: '#FF3B30',
        borderColor: '#FF3B30',
        pointRadius: 5,
        pointHoverRadius: 8,
        showLine: false
      },
      {
        label: 'Baseline Human Web Sessions',
        data: normalPoints,
        backgroundColor: 'rgba(0, 229, 255, 0.4)',
        borderColor: '#00E5FF',
        pointRadius: 3,
        pointHoverRadius: 5,
        showLine: false
      }
    ]
  };

  const options = {
    scales: {
      x: {
        title: { display: true, text: 'Time Elapsed (Minutes)', color: '#94A3B8', font: { size: 10, family: "'JetBrains Mono', monospace" } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 10, family: "'JetBrains Mono', monospace" } }
      },
      y: {
        title: { display: true, text: 'Inter-Arrival Interval (Seconds)', color: '#94A3B8', font: { size: 10, family: "'JetBrains Mono', monospace" } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 10, family: "'JetBrains Mono', monospace" } },
        min: 0,
        max: 300
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#E2E8F0',
          font: { size: 11, family: "'JetBrains Mono', monospace" }
        }
      }
    },
    maintainAspectRatio: false
  };

  const handleInspect = () => {
    const threat = SAMPLE_EXPLANATIONS['c2-beacon'];
    if (onSelectThreat) onSelectThreat(threat);
    if (onSelectExplanation) onSelectExplanation(threat);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 bg-[#0B1020]/90 flex flex-col justify-between font-mono select-none">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <Crosshair size={16} className="text-red-400 animate-pulse" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            8. BEACONING INTERVAL SCATTER PLOT
          </h4>
        </div>

        <button
          onClick={handleInspect}
          className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-[10px] font-bold transition flex items-center gap-1"
        >
          <Eye size={12} /> EXPLAIN IAT CLUSTER
        </button>
      </div>

      <div className="h-60 w-full relative">
        <Scatter data={data} options={options} />
        {/* Visual Bounding Box Indicator for the 60s Cluster */}
        <div className="absolute top-[68%] left-[10%] right-[5%] h-5 border-2 border-dashed border-red-500/60 bg-red-500/10 pointer-events-none rounded flex items-center justify-end px-2">
          <span className="text-[9px] text-red-400 font-bold bg-black/60 px-1 rounded">CV = 0.12 (STRICT 60s BOTNET PULSE)</span>
        </div>
      </div>

      <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
        <span>STATISTICAL CRITERIA: CV &lt; 0.30 INDICATES AUTOMATED MACHINE HEARTBEAT</span>
        <span className="text-red-400 font-bold">P = 0.94 CERTAINTY</span>
      </div>
    </div>
  );
};

export default BeaconingScatterPlot;
