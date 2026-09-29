import React, { useState } from 'react';
import { 
  BeaconingScatterPlot,
  DnsEntropyLineGraph,
  DataExfilSankey,
  PortScanMatrixGrid,
  ProtocolActivityStream,
  ConfidenceDonut,
  ExplainabilityPanel,
  ThreatExplanationData,
  SAMPLE_EXPLANATIONS
} from '../components/soc-graphs';
import { Activity, Brain, Shield, Crosshair, Database } from 'lucide-react';

export const DetectionAnalytics: React.FC = () => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatExplanationData | null>(null);

  const engineStats = [
    { engine: 'Reconnaissance & Scan Engine', detections: 64, accuracy: 98.4, type: 'Z-Score / Port Fanout', icon: <Crosshair className="text-[#FFA726]" size={20} /> },
    { engine: 'C2 Beaconing & Heartbeat', detections: 28, accuracy: 97.2, type: 'IAT CV < 0.30', icon: <Activity className="text-[#00E5FF]" size={20} /> },
    { engine: 'DNS Abuse & DGA Engine', detections: 42, accuracy: 99.1, type: 'Shannon Entropy > 3.5b', icon: <Brain className="text-[#A855F7]" size={20} /> },
    { engine: 'Encrypted Traffic Anomaly', detections: 35, accuracy: 96.5, type: 'JA3 / TLS Fingerprint', icon: <Shield className="text-[#10B981]" size={20} /> },
    { engine: 'Data Exfiltration Engine', detections: 18, accuracy: 95.8, type: 'IQR Outlier / Asymmetric', icon: <Database className="text-[#FF3B30]" size={20} /> }
  ];

  return (
    <div className="flex flex-col gap-6 pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse" />
            Detection Analytics & Statistical Forensic Engines
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Real-time passive evaluation of unidirectional IP streams across 5 statistical and heuristic detection algorithms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-mono font-bold">
            ZEEK METADATA + WAZUH SIEM
          </span>
        </div>
      </div>

      {/* 5 Engine Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {engineStats.map((stat, idx) => (
          <div 
            key={idx}
            onClick={() => {
              if (idx === 0) setSelectedThreat(SAMPLE_EXPLANATIONS['port-scan']);
              else if (idx === 1) setSelectedThreat(SAMPLE_EXPLANATIONS['c2-beacon']);
              else if (idx === 2) setSelectedThreat(SAMPLE_EXPLANATIONS['dns-tunnel']);
              else if (idx === 3) setSelectedThreat(SAMPLE_EXPLANATIONS['ja3-anomaly']);
              else setSelectedThreat(SAMPLE_EXPLANATIONS['exfiltration']);
            }}
            className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-4 shadow-[0_0_15px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col justify-between cursor-pointer hover:border-[#00E5FF] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-[#050811] border border-[#00E5FF]/20">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {stat.accuracy}% ACC
                </span>
              </div>
              <div className="text-xs font-bold text-white tracking-wide">{stat.engine}</div>
              <div className="text-[10px] font-mono text-gray-400 mt-0.5">{stat.type}</div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#00E5FF]/10 flex items-baseline justify-between font-mono">
              <span className="text-[10px] text-gray-500 uppercase">Detections:</span>
              <span className="text-sm font-bold text-white">{stat.detections} Alerts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 1: Data Exfiltration Flow Sankey (#10) */}
      <DataExfilSankey onSelectThreat={setSelectedThreat} />

      {/* Row 2: Port Probing Density Thermal Matrix (#11) */}
      <PortScanMatrixGrid onSelectThreat={setSelectedThreat} />

      {/* Row 3: IAT Beaconing Scatter Plot (#8) & DNS Shannon Entropy Line Graph (#9) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BeaconingScatterPlot onSelectThreat={setSelectedThreat} />
        <DnsEntropyLineGraph onSelectThreat={setSelectedThreat} />
      </div>

      {/* Row 4: Protocol Activity Stream (#7) & AI Confidence Breakdown (#6) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProtocolActivityStream onSelectThreat={setSelectedThreat} />
        </div>
        <div className="lg:col-span-1">
          <ConfidenceDonut onSelectThreat={setSelectedThreat} />
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

export default DetectionAnalytics;
