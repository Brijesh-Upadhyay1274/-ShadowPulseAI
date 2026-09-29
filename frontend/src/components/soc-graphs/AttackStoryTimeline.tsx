import React, { useState } from 'react';
import { Terminal, Eye, CheckCircle2 } from 'lucide-react';
import { SAMPLE_EXPLANATIONS, ThreatExplanationData } from './ExplainabilityPanel';

export interface AttackStage {
  id: string;
  stageName: string;
  mitreId: string;
  timestamp: string;
  source: string;
  target: string;
  summary: string;
  severity: 'critical' | 'high' | 'medium';
  confidence: number;
  explanationKey: string;
  evidence: string[];
}

export const ATTACK_STAGES: AttackStage[] = [
  {
    id: 'STG-01',
    stageName: '1. Reconnaissance',
    mitreId: 'T1595',
    timestamp: '09:12:00 UTC',
    source: '172.16.0.99',
    target: '10.0.0.10:22',
    summary: 'Initial perimeter probe & SSH brute force spray',
    severity: 'high',
    confidence: 86,
    explanationKey: 'c2-beacon',
    evidence: ['15 SSH login attempts within 60s', 'SYN packets from Tor Exit Node (185.220.101.5)', 'Non-standard client cipher suite']
  },
  {
    id: 'STG-02',
    stageName: '2. Port Scan Sweep',
    mitreId: 'T1046',
    timestamp: '09:14:22 UTC',
    source: '192.168.1.100',
    target: '10.0.0.5 (220 Ports)',
    summary: 'Internal lateral scan targeting critical domain assets',
    severity: 'high',
    confidence: 89,
    explanationKey: 'c2-beacon',
    evidence: ['Fan-out ratio > 20 ports/min', 'SYN packets with REJ/RST flags', 'Z-score connection deviation > 4.2 sigma']
  },
  {
    id: 'STG-03',
    stageName: '3. C2 Beaconing',
    mitreId: 'T1071',
    timestamp: '09:22:10 UTC',
    source: '10.0.1.50',
    target: '198.51.100.44:8443',
    summary: 'Deterministic C2 callbacks to Bulletproof Hosting ASN 9009',
    severity: 'critical',
    confidence: 94,
    explanationKey: 'c2-beacon',
    evidence: ['IAT Coefficient of Variation (CV = 0.12)', 'Regular 60s interval heartbeat pattern', 'Zeek conn.log TLS payload size match']
  },
  {
    id: 'STG-04',
    stageName: '4. DNS Tunneling',
    mitreId: 'T1572',
    timestamp: '09:26:15 UTC',
    source: '10.0.1.50',
    target: '8.8.8.8:53 (tunnel.evil.com)',
    summary: 'Base64 TXT covert channel encoded internal reconnaissance',
    severity: 'critical',
    confidence: 95,
    explanationKey: 'dns-tunnel',
    evidence: ['Shannon entropy 4.22 bits (Baseline < 3.50)', 'Subdomain length 78 chars exceeding RFC', 'Base64 alphabet charset validation']
  },
  {
    id: 'STG-05',
    stageName: '5. Encrypted C2',
    mitreId: 'T1573.002',
    timestamp: '09:30:00 UTC',
    source: '10.0.1.50',
    target: '198.51.100.44:8443',
    summary: 'Cobalt Strike TLS profile matched in unidirectional stream',
    severity: 'critical',
    confidence: 98,
    explanationKey: 'ja3-anomaly',
    evidence: ['JA3 hash match: 72a589da586844d7f0818ce684948eea', 'Self-signed x509 cert CN mismatch', 'Non-browser cipher suite list']
  },
  {
    id: 'STG-06',
    stageName: '6. Data Exfiltration',
    mitreId: 'T1048',
    timestamp: '09:35:22 UTC',
    source: '10.0.1.50',
    target: '203.0.113.66:443',
    summary: 'Asymmetric bulk data egress to Cloudflare proxy drop',
    severity: 'critical',
    confidence: 96,
    explanationKey: 'exfiltration',
    evidence: ['52.4MB outbound spike (43.2x upload/download ratio)', 'Passive IQR outlier engine trigger (6.4σ)', 'Zeek orig_bytes exfiltration signature']
  }
];

interface AttackStoryTimelineProps {
  onSelectThreat?: (threat: ThreatExplanationData) => void;
  onSelectExplanation?: (data: ThreatExplanationData) => void;
}

export const AttackStoryTimeline: React.FC<AttackStoryTimelineProps> = ({ 
  onSelectThreat,
  onSelectExplanation 
}) => {
  const [activeStageId, setActiveStageId] = useState<string>('STG-03');

  const selectedStage = ATTACK_STAGES.find(s => s.id === activeStageId) || ATTACK_STAGES[2];

  const handleSelect = (stage: AttackStage) => {
    const data = SAMPLE_EXPLANATIONS[stage.explanationKey] || SAMPLE_EXPLANATIONS['c2-beacon'];
    if (onSelectThreat) onSelectThreat(data);
    if (onSelectExplanation) onSelectExplanation(data);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 flex flex-col gap-5 bg-[#0B1020]/90 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span>2. MITRE ATT&CK ATTACK STORY TIMELINE</span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                APT29 CAMPAIGN DETECTED
              </span>
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Horizontal Kill-Chain Storyline Reconstructed from Unidirectional TAP Metadata
            </p>
          </div>
        </div>

        <button 
          onClick={() => handleSelect(selectedStage)}
          className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.2)]"
        >
          <Eye size={14} /> EXPLAIN SELECTED STAGE ({selectedStage.stageName.split(' ')[1]})
        </button>
      </div>

      {/* Horizontal Interactive Animated Timeline Stepper */}
      <div className="relative pt-3 pb-4 overflow-x-auto">
        {/* Connecting Neon Line */}
        <div className="absolute top-[28px] left-6 right-6 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 z-0 opacity-40"></div>

        <div className="flex items-center justify-between min-w-[750px] relative z-10 px-2">
          {ATTACK_STAGES.map((stage, idx) => {
            const isSelected = activeStageId === stage.id;
            const isCritical = stage.severity === 'critical';

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className="flex flex-col items-center gap-2 group cursor-pointer transition-all"
              >
                {/* Node Pill / Dot */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-200 border-2 ${
                  isSelected 
                    ? 'bg-red-500 text-white border-white scale-110 shadow-[0_0_20px_#FF3B30]' 
                    : isCritical 
                    ? 'bg-[#0B1020] text-red-400 border-red-500 group-hover:scale-105' 
                    : 'bg-[#0B1020] text-orange-400 border-orange-500 group-hover:scale-105'
                }`}>
                  {idx + 1}
                </div>

                {/* Stage Title */}
                <div className="text-center font-mono">
                  <div className={`text-xs font-bold transition ${isSelected ? 'text-cyan-300' : 'text-gray-300 group-hover:text-white'}`}>
                    {stage.stageName.split('. ')[1]}
                  </div>
                  <div className="text-[10px] text-gray-500">{stage.timestamp.split(' ')[0]}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Stage Forensic Dossier Card */}
      <div className="bg-[#050811] p-4 rounded-xl border border-white/10 font-mono">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase">{selectedStage.stageName}:</span>
            <span className="text-xs text-gray-300">{selectedStage.summary}</span>
          </div>
          <span className="text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30 text-xs">
            MITRE {selectedStage.mitreId}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <div className="bg-[#0B1020] p-2.5 rounded-lg border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase">SOURCE VECTOR</div>
            <div className="text-red-400 font-bold mt-0.5 select-all text-xs">{selectedStage.source}</div>
          </div>
          <div className="bg-[#0B1020] p-2.5 rounded-lg border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase">TARGET DESTINATION</div>
            <div className="text-cyan-400 font-bold mt-0.5 select-all text-xs">{selectedStage.target}</div>
          </div>
          <div className="bg-[#0B1020] p-2.5 rounded-lg border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase">DETECTION TIMESTAMP</div>
            <div className="text-gray-300 mt-0.5 text-xs">{selectedStage.timestamp}</div>
          </div>
        </div>

        {/* Forensic Evidence Items */}
        <div>
          <div className="text-[10px] text-gray-500 uppercase mb-1.5 flex items-center gap-1">
            <Terminal size={12} className="text-cyan-400" /> CORRELATED FORENSIC EVIDENCE:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {selectedStage.evidence.map((ev, i) => (
              <div key={i} className="p-2 rounded bg-white/[0.02] border border-white/5 text-[11px] text-gray-200 flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>{ev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackStoryTimeline;
