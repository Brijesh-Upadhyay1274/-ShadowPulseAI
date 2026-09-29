import React, { useState } from 'react';
import { 
  AttackStoryTimeline,
  ThreatDnaRadar,
  ExplainabilityPanel,
  ThreatExplanationData,
  SAMPLE_EXPLANATIONS
} from '../components/soc-graphs';
import { ArrowRight, Zap } from 'lucide-react';

interface Incident {
  id: string;
  name: string;
  threatActor: string;
  status: 'ACTIVE INVESTIGATION' | 'CONTAINED' | 'MITIGATED';
  severity: 'critical' | 'high' | 'medium';
  confidence: number;
  explanationKey: string;
  firstSeen: string;
  primaryAttacker: string;
  targetAsset: string;
  summary: string;
}

const INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-001',
    name: 'Cobalt Strike C2 Beaconing & Covert Tunneling',
    threatActor: 'APT29 / Nobelium Equivalent',
    status: 'ACTIVE INVESTIGATION',
    severity: 'critical',
    confidence: 94,
    explanationKey: 'c2-beacon',
    firstSeen: '2026-09-28 09:14:00 UTC',
    primaryAttacker: '198.51.100.44 (Bulletproof ASN 9009)',
    targetAsset: '10.0.1.50 (WS-FINANCE-09)',
    summary: 'High-frequency deterministic check-ins (CV=0.12) paired with JA3 signature match (72a589da) and covert Base64 DNS exfiltration.'
  },
  {
    id: 'INC-2026-002',
    name: 'Base64 DNS TXT Data Exfiltration Channel',
    threatActor: 'Lazarus / APT38 Mimic',
    status: 'ACTIVE INVESTIGATION',
    severity: 'critical',
    confidence: 95,
    explanationKey: 'dns-tunnel',
    firstSeen: '2026-09-28 09:15:30 UTC',
    primaryAttacker: 'tunnel.evil.com (AS15169 Public DNS)',
    targetAsset: '10.0.1.50 (WS-FINANCE-09)',
    summary: 'Massive volume of high-entropy TXT record requests (4.22 bits Shannon Entropy) encoding internal database schema.'
  },
  {
    id: 'INC-2026-003',
    name: 'Asymmetric Outbound Database Exfiltration',
    threatActor: 'Unknown Insider / External Drop',
    status: 'CONTAINED',
    severity: 'critical',
    confidence: 96,
    explanationKey: 'exfiltration',
    firstSeen: '2026-09-28 09:18:45 UTC',
    primaryAttacker: '203.0.113.66 (Cloudflare Proxy)',
    targetAsset: '10.0.2.15 (DB-CORE-SQL)',
    summary: '52.4MB uploaded over HTTPS/443 with 43.2x upload-to-download byte asymmetry ratio flagged by passive IQR outlier engine.'
  }
];

export const ThreatInvestigation: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident>(INCIDENTS[0]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatExplanationData | null>(null);

  const handleOpenExplainability = (explanationKey: string) => {
    const data = SAMPLE_EXPLANATIONS[explanationKey] || SAMPLE_EXPLANATIONS['c2-beacon'];
    setSelectedThreat(data);
  };

  return (
    <div className="flex flex-col gap-6 pb-12 font-sans">
      {/* Top Incident Header */}
      <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40 animate-pulse">
              {selectedIncident.status}
            </span>
            <span className="text-xs font-mono text-gray-400">{selectedIncident.id}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide mt-1">
            {selectedIncident.name}
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-3xl">
            {selectedIncident.summary}
          </p>
        </div>

        <button
          onClick={() => handleOpenExplainability(selectedIncident.explanationKey)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/50 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
        >
          <Zap size={15} />
          <span>Launch AI 6-Pillar Explainability</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Main Layout: Left Incident List + Right Detailed Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Incidents List */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <div className="text-xs font-mono text-gray-400 px-1 uppercase tracking-wider flex items-center justify-between">
            <span>ACTIVE INCIDENTS (3)</span>
            <span className="text-[#00E5FF]">LIVE TAP</span>
          </div>

          {INCIDENTS.map(inc => {
            const isSelected = selectedIncident.id === inc.id;
            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#FF3B30]/10 border-[#FF3B30] shadow-[0_0_20px_rgba(255,59,48,0.2)]'
                    : 'bg-[#0B1020]/90 border-[#00E5FF]/15 hover:border-[#00E5FF]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-gray-400">{inc.id}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40">
                    {inc.severity.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs font-bold text-white mb-1.5 line-clamp-1">{inc.name}</div>
                <div className="text-[11px] text-gray-400 mb-3">{inc.threatActor}</div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#00E5FF]/10">
                  <span className="text-gray-500">Confidence:</span>
                  <span className="text-emerald-400 font-bold">{inc.confidence}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 3 Columns: Incident Investigation Workspace */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Metadata Triage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-3.5 backdrop-blur-md">
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">PRIMARY ATTACKER / IOC</div>
              <div className="font-mono text-xs font-bold text-[#FF3B30] truncate">{selectedIncident.primaryAttacker}</div>
            </div>
            <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-3.5 backdrop-blur-md">
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">TARGETED ASSET</div>
              <div className="font-mono text-xs font-bold text-[#00E5FF] truncate">{selectedIncident.targetAsset}</div>
            </div>
            <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-3.5 backdrop-blur-md">
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">DETECTION TIMESTAMP</div>
              <div className="font-mono text-xs font-bold text-gray-300">{selectedIncident.firstSeen}</div>
            </div>
          </div>

          {/* Interactive MITRE Attack Story Timeline (#2) */}
          <AttackStoryTimeline onSelectThreat={setSelectedThreat} />

          {/* Threat DNA Radar Chart (#3) */}
          <ThreatDnaRadar onSelectThreat={setSelectedThreat} />
        </div>
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

export default ThreatInvestigation;
