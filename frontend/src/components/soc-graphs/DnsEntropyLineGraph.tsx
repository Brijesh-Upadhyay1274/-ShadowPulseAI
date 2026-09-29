import React from 'react';
import { Line } from 'react-chartjs-2';
import { Globe, Eye } from 'lucide-react';
import { SAMPLE_EXPLANATIONS, ThreatExplanationData } from './ExplainabilityPanel';

interface DnsEntropyLineGraphProps {
  onSelectThreat?: (threat: ThreatExplanationData) => void;
  onSelectExplanation?: (data: ThreatExplanationData) => void;
}

export const DnsEntropyLineGraph: React.FC<DnsEntropyLineGraphProps> = ({ 
  onSelectThreat,
  onSelectExplanation 
}) => {
  const labels = [
    'google.com', 'microsoft.com', 'github.com', 'gov.in', 'cloudflare.com',
    'xk7m9p2qr5v8.evil.top', 'aGVsbG8gd29ybGQg.tunnel.evil.com', 'z9q1v4b7n2.xyz',
    'amazon.in', 'wikipedia.org', 'update-service.cc', 'ntro.gov.in'
  ];

  // Entropy values in bits (English text ~3.0-3.3, DGA/Tunnel > 3.5 up to 4.5)
  const entropyData = [3.1, 3.2, 2.9, 2.4, 3.3, 4.22, 4.45, 4.18, 3.0, 3.2, 3.9, 2.8];
  const thresholdData = labels.map(() => 3.5);

  const data = {
    labels,
    datasets: [
      {
        label: 'Domain Shannon Entropy H(X)',
        data: entropyData,
        borderColor: '#00E5FF',
        backgroundColor: 'rgba(0, 229, 255, 0.15)',
        borderWidth: 2,
        pointBackgroundColor: entropyData.map(v => v > 3.5 ? '#FF3B30' : '#00E5FF'),
        pointBorderColor: '#FFFFFF',
        pointRadius: entropyData.map(v => v > 3.5 ? 6 : 3),
        tension: 0.3,
        fill: false
      },
      {
        label: 'DGA/Tunneling Threshold (3.5 Bits)',
        data: thresholdData,
        borderColor: '#FF3B30',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const options = {
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { 
          color: '#94A3B8', 
          font: { size: 9, family: "'JetBrains Mono', monospace" },
          maxRotation: 45,
          minRotation: 25
        }
      },
      y: {
        title: { display: true, text: 'Shannon Entropy (Bits)', color: '#94A3B8', font: { size: 10, family: "'JetBrains Mono', monospace" } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 10, family: "'JetBrains Mono', monospace" } },
        min: 2.0,
        max: 5.0
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
    const threat = SAMPLE_EXPLANATIONS['dns-tunnel'];
    if (onSelectThreat) onSelectThreat(threat);
    if (onSelectExplanation) onSelectExplanation(threat);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 bg-[#0B1020]/90 flex flex-col justify-between font-mono select-none">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            9. DNS SHANNON ENTROPY & DGA THRESHOLD
          </h4>
        </div>

        <button
          onClick={handleInspect}
          className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-[10px] font-bold transition flex items-center gap-1"
        >
          <Eye size={12} /> EXPLAIN DGA SPIKE
        </button>
      </div>

      <div className="h-60 w-full">
        <Line data={data} options={options} />
      </div>

      <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
        <span>CRITERIA: H(X) &gt; 3.5 BITS FLAGS BASE64/DGA OVER PASSIVE DNS TAP</span>
        <span className="text-cyan-400 font-bold">4 ANOMALIES FLAGGED</span>
      </div>
    </div>
  );
};

export default DnsEntropyLineGraph;
