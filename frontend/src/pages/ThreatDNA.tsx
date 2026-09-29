import React, { useState } from 'react';
import { 
  ThreatDnaRadar, 
  ExplainabilityPanel, 
  ThreatExplanationData, 
  SAMPLE_EXPLANATIONS 
} from '../components/soc-graphs';
import { Dna, Zap } from 'lucide-react';

export const ThreatDNA: React.FC = () => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatExplanationData | null>(null);

  const baselineSignatures = [
    {
      name: 'Cobalt Strike 4.9 Standard C2 Profile',
      recon: 65,
      c2: 95,
      dns: 88,
      crypto: 92,
      exfil: 78,
      volume: 45,
      match: 94,
      severity: 'critical'
    },
    {
      name: 'APT29 Cozy Bear Stealth Egress',
      recon: 40,
      c2: 85,
      dns: 96,
      crypto: 90,
      exfil: 82,
      volume: 30,
      match: 89,
      severity: 'critical'
    },
    {
      name: 'Mirai IoT Port Sweep / Brute Force',
      recon: 95,
      c2: 30,
      dns: 20,
      crypto: 15,
      exfil: 10,
      volume: 90,
      match: 32,
      severity: 'high'
    }
  ];

  return (
    <div className="flex flex-col gap-6 pb-12 font-sans">
      {/* Header */}
      <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
              <Dna size={22} className="animate-spin-slow" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Adversary Threat DNA & Behavioral Fingerprinting
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            6-dimensional quantitative threat vector mapping observed passive network anomalies against known APT profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedThreat(SAMPLE_EXPLANATIONS['c2-beacon'])}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/50 text-xs font-mono font-bold transition-all"
          >
            <Zap size={14} />
            <span>Explain Vector Correlation</span>
          </button>
        </div>
      </div>

      {/* Main Threat DNA Radar Chart (#3) */}
      <ThreatDnaRadar onSelectThreat={setSelectedThreat} />

      {/* Profile Vector Similarity Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {baselineSignatures.map((sig, i) => (
          <div 
            key={i}
            className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  sig.severity === 'critical' ? 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40' : 'bg-[#FFA726]/20 text-[#FFA726] border border-[#FFA726]/40'
                }`}>
                  {sig.severity} PROFILE
                </span>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 font-mono">COSINE SIMILARITY</span>
                  <div className="text-base font-mono font-bold text-[#00E5FF]">{sig.match}% MATCH</div>
                </div>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">{sig.name}</h4>
            </div>

            <div className="mt-4 pt-4 border-t border-[#00E5FF]/10 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-gray-400">
                <span>C2 Beaconing:</span>
                <span className="text-white font-bold">{sig.c2}/100</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>DNS Tunnel Abuse:</span>
                <span className="text-white font-bold">{sig.dns}/100</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>JA3 TLS Anomaly:</span>
                <span className="text-white font-bold">{sig.crypto}/100</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Data Exfiltration:</span>
                <span className="text-white font-bold">{sig.exfil}/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Explainability Drawer Modal */}
      {selectedThreat && (
        <ExplainabilityPanel
          threat={selectedThreat}
          onClose={() => setSelectedThreat(null)}
        />
      )}
    </div>
  );
};

export default ThreatDNA;
