import React from 'react';
import { Radar } from 'react-chartjs-2';
import { ThreatExplanationData, SAMPLE_EXPLANATIONS } from './ExplainabilityPanel';

interface ThreatDnaRadarProps {
  dna?: {
    recon: number;
    beaconing: number;
    dnsAbuse: number;
    encryption: number;
    exfiltration: number;
    confidence: number;
  };
  coverage?: {
    recon: number;
    beaconing: number;
    dnsAbuse: number;
    encryption: number;
    exfiltration: number;
    confidence: number;
  };
  incidentName?: string;
  onSelectThreat?: (threat: ThreatExplanationData) => void;
}

export const ThreatDnaRadar: React.FC<ThreatDnaRadarProps> = ({
  dna = { recon: 88, beaconing: 94, dnsAbuse: 92, encryption: 98, exfiltration: 95, confidence: 94 },
  coverage = { recon: 70, beaconing: 85, dnsAbuse: 80, encryption: 75, exfiltration: 80, confidence: 90 },
  incidentName = 'APT29 Spearphishing Vector',
  onSelectThreat
}) => {
  const data = {
    labels: [
      'Reconnaissance',
      'Beaconing (C2)',
      'DNS Abuse (DGA/Tunnel)',
      'Encrypted Malware (JA3)',
      'Data Exfiltration',
      'AI Confidence'
    ],
    datasets: [
      {
        label: 'Adversary Threat DNA',
        data: [dna.recon, dna.beaconing, dna.dnsAbuse, dna.encryption, dna.exfiltration, dna.confidence],
        backgroundColor: 'rgba(255, 59, 48, 0.25)',
        borderColor: '#FF3B30',
        borderWidth: 2,
        pointBackgroundColor: '#FF3B30',
        pointBorderColor: '#FFFFFF',
        pointRadius: 3,
      },
      {
        label: 'NTRO Defense Baseline',
        data: [coverage.recon, coverage.beaconing, coverage.dnsAbuse, coverage.encryption, coverage.exfiltration, coverage.confidence],
        backgroundColor: 'rgba(0, 229, 255, 0.15)',
        borderColor: '#00E5FF',
        borderWidth: 2,
        pointBackgroundColor: '#00E5FF',
        pointBorderColor: '#FFFFFF',
        pointRadius: 3,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(0, 229, 255, 0.15)' },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        pointLabels: { 
          color: '#00E5FF', 
          font: { size: 10, family: "'JetBrains Mono', monospace" } 
        },
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: { 
        position: 'bottom' as const, 
        labels: { 
          color: '#E2E8F0', 
          font: { size: 11, family: "'JetBrains Mono', monospace" } 
        } 
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between bg-[#0B1020]/90 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            3. THREAT DNA BEHAVIORAL RADAR
          </h4>
          <p className="text-[11px] text-gray-400 font-mono">{incidentName}</p>
        </div>
        <button
          onClick={() => onSelectThreat && onSelectThreat(SAMPLE_EXPLANATIONS['c2-beacon'])}
          className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition"
        >
          94% APT MATCH
        </button>
      </div>

      <div className="h-64 w-full">
        <Radar data={data} options={options} />
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FF3B30] shadow-[0_0_8px_#FF3B30]"></span>
          <span className="text-gray-300">Observed Adversary DNA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></span>
          <span className="text-gray-300">Defense Capacity</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatDnaRadar;
