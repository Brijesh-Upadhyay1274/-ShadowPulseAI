import React from 'react';
import { Line } from 'react-chartjs-2';
import { Activity } from 'lucide-react';
import { ThreatExplanationData, SAMPLE_EXPLANATIONS } from './ExplainabilityPanel';

interface ProtocolActivityStreamProps {
  onSelectThreat?: (threat: ThreatExplanationData) => void;
}

export const ProtocolActivityStream: React.FC<ProtocolActivityStreamProps> = ({ onSelectThreat }) => {
  const labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  // Realistic protocol volume telemetry streams
  const tlsData = labels.map((_, i) => 1200 + (Math.sin(i / 3) * 300) + (i === 14 ? 1800 : 0));
  const dnsData = labels.map((_, i) => 450 + (Math.cos(i / 2) * 120) + (i === 14 ? 650 : 0));
  const tcpData = labels.map((_, i) => 300 + (Math.sin(i / 4) * 80));
  const quicData = labels.map((_, i) => 180 + (Math.cos(i / 3) * 50));
  const httpData = labels.map((_, i) => 120 + (Math.sin(i / 2) * 40));

  const data = {
    labels,
    datasets: [
      {
        label: 'TLS / HTTPS',
        data: tlsData,
        backgroundColor: 'rgba(0, 229, 255, 0.4)',
        borderColor: '#00E5FF',
        borderWidth: 1.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'DNS Traffic',
        data: dnsData,
        backgroundColor: 'rgba(255, 167, 38, 0.4)',
        borderColor: '#FFA726',
        borderWidth: 1.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Raw TCP',
        data: tcpData,
        backgroundColor: 'rgba(255, 59, 48, 0.35)',
        borderColor: '#FF3B30',
        borderWidth: 1.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'QUIC / UDP',
        data: quicData,
        backgroundColor: 'rgba(168, 85, 247, 0.3)',
        borderColor: '#A855F7',
        borderWidth: 1.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Plaintext HTTP',
        data: httpData,
        backgroundColor: 'rgba(100, 116, 139, 0.3)',
        borderColor: '#64748B',
        borderWidth: 1.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  const options = {
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 10, family: "'JetBrains Mono', monospace" }, maxTicksLimit: 8 }
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 10, family: "'JetBrains Mono', monospace" } }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#E2E8F0',
          font: { size: 11, family: "'JetBrains Mono', monospace" },
          boxWidth: 12
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 bg-[#0B1020]/90 flex flex-col justify-between font-mono select-none">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-cyan-400 animate-pulse" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            7. PROTOCOL ACTIVITY STREAM (STACKED AREA)
          </h4>
        </div>
        <span className="text-[11px] text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
          REAL-TIME FLOW (EPS: 3,492)
        </span>
      </div>

      <div className="h-60 w-full">
        <Line data={data} options={options} />
      </div>

      <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
        <span>PEAK EGRESS SURGE AT 14:00 UTC (ANOMALOUS 52.4MB EXFILTRATION DETECTED)</span>
        <button
          onClick={() => onSelectThreat && onSelectThreat(SAMPLE_EXPLANATIONS['exfiltration'])}
          className="text-red-400 font-bold hover:underline"
        >
          +184% DEVIATION (EXPLAIN)
        </button>
      </div>
    </div>
  );
};

export default ProtocolActivityStream;
