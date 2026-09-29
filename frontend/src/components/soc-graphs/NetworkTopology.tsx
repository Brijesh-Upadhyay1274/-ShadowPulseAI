import React, { useState } from 'react';
import { Shield, Globe, Lock, ArrowRight, Activity } from 'lucide-react';
import { SAMPLE_EXPLANATIONS, ThreatExplanationData } from './ExplainabilityPanel';

interface NetworkTopologyProps {
  onSelectThreat?: (threat: ThreatExplanationData) => void;
  onSelectExplanation?: (data: ThreatExplanationData) => void;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({ 
  onSelectThreat,
  onSelectExplanation 
}) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('c2-beacon');

  const handleInspect = () => {
    const data = SAMPLE_EXPLANATIONS[selectedRoute] || SAMPLE_EXPLANATIONS['c2-beacon'];
    if (onSelectThreat) onSelectThreat(data);
    if (onSelectExplanation) onSelectExplanation(data);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 bg-[#0B1020]/90 flex flex-col justify-between select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 font-mono">
        <div className="flex items-center gap-2.5">
          <Activity size={16} className="text-cyan-400 animate-pulse" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            4. LIVE UNIDIRECTIONAL NETWORK TOPOLOGY
          </h4>
        </div>
        <span className="text-[11px] text-red-400 font-bold px-2 py-0.5 rounded bg-red-500/20 border border-red-500/30">
          2 COMPROMISED PATHS DETECTED
        </span>
      </div>

      {/* SVG Topology Grid Visualizer */}
      <div className="relative bg-[#030712] rounded-xl p-4 border border-white/10 overflow-hidden font-mono text-xs">
        {/* Background Network Zones Overlay */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 min-h-64 relative z-0">
          {/* External Untrusted Zone */}
          <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-2.5 flex flex-col justify-between">
            <div className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1">
              <Globe size={12} /> EXTERNAL UNTRUSTED
            </div>
            
            <div className="space-y-2 my-2">
              <div 
                onClick={() => setSelectedRoute('c2-beacon')}
                className={`p-2 rounded bg-[#0B1020] border cursor-pointer transition ${
                  selectedRoute === 'c2-beacon' ? 'border-red-500 shadow-[0_0_12px_#FF3B30]' : 'border-red-500/40 hover:border-red-500'
                }`}
              >
                <div className="text-white font-bold text-[11px]">198.51.100.44</div>
                <div className="text-[10px] text-red-400">CobaltStrike Master C2</div>
              </div>

              <div 
                onClick={() => setSelectedRoute('exfiltration')}
                className={`p-2 rounded bg-[#0B1020] border cursor-pointer transition ${
                  selectedRoute === 'exfiltration' ? 'border-red-500 shadow-[0_0_12px_#FF3B30]' : 'border-red-500/40 hover:border-red-500'
                }`}
              >
                <div className="text-white font-bold text-[11px]">203.0.113.66</div>
                <div className="text-[10px] text-red-400">Exfiltration Drop Host</div>
              </div>
            </div>

            <div className="text-[9px] text-gray-500">ZONE 0: WAN / UNTRUSTED</div>
          </div>

          {/* DMZ / Perimeter Gateway */}
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-950/10 p-2.5 flex flex-col justify-between">
            <div className="text-[10px] font-bold text-yellow-400 uppercase flex items-center gap-1">
              <Shield size={12} /> DMZ PERIMETER TAP
            </div>

            <div className="space-y-2 my-2">
              <div 
                onClick={() => setSelectedRoute('dns-tunnel')}
                className={`p-2 rounded bg-[#0B1020] border cursor-pointer transition ${
                  selectedRoute === 'dns-tunnel' ? 'border-yellow-500 shadow-[0_0_12px_#FFA726]' : 'border-yellow-500/40 hover:border-yellow-500'
                }`}
              >
                <div className="text-white font-bold text-[11px]">tunnel.evil.com</div>
                <div className="text-[10px] text-yellow-400">DNS Covert Gateway</div>
              </div>

              <div className="p-2 rounded bg-[#0B1020] border border-white/10">
                <div className="text-white font-bold text-[11px]">10.0.0.10</div>
                <div className="text-[10px] text-gray-400">SSH Perimeter Bastion</div>
              </div>
            </div>

            <div className="text-[9px] text-gray-500">ZONE 1: DMZ TAP SENSOR</div>
          </div>

          {/* Internal Protected Core */}
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/10 p-2.5 flex flex-col justify-between">
            <div className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
              <Lock size={12} /> INTERNAL PROTECTED CORE
            </div>

            <div className="space-y-2 my-2">
              <div 
                onClick={() => setSelectedRoute('c2-beacon')}
                className={`p-2 rounded bg-[#0B1020] border cursor-pointer transition ${
                  selectedRoute === 'c2-beacon' ? 'border-red-500 shadow-[0_0_12px_#FF3B30]' : 'border-cyan-500/40 hover:border-cyan-500'
                }`}
              >
                <div className="text-red-400 font-bold text-[11px] flex items-center justify-between">
                  <span>10.0.1.50</span>
                  <span className="text-[9px] px-1 bg-red-500 text-white rounded">BREACH</span>
                </div>
                <div className="text-[10px] text-gray-300">WS-FINANCE-09 (Compromised)</div>
              </div>

              <div className="p-2 rounded bg-[#0B1020] border border-cyan-500/40">
                <div className="text-cyan-300 font-bold text-[11px]">10.0.0.5</div>
                <div className="text-[10px] text-gray-400">DC-PROD-01 (Domain Ctrl)</div>
              </div>
            </div>

            <div className="text-[9px] text-gray-500">ZONE 2: CLASSIFIED LAN</div>
          </div>
        </div>
      </div>

      {/* Route Inspector Footer */}
      <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">ACTIVE COMPROMISE ROUTE:</span>
          <span className="text-red-400 font-bold">
            {selectedRoute === 'c2-beacon' ? '10.0.1.50 → 198.51.100.44:8443 (C2 Beacon)' : selectedRoute === 'dns-tunnel' ? '10.0.1.50 → tunnel.evil.com (DNS Tunnel)' : '10.0.1.50 → 203.0.113.66 (52.4MB Exfil)'}
          </span>
        </div>

        <button
          onClick={handleInspect}
          className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-[11px] font-bold transition flex items-center gap-1"
        >
          <span>EXPLAIN ROUTE</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default NetworkTopology;
