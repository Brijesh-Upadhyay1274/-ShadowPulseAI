import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, ExternalLink, HardDrive, Cpu, Radio, AlertTriangle, Layers } from 'lucide-react';
import { ThreatExplanationData, SAMPLE_EXPLANATIONS } from './ExplainabilityPanel';

interface SankeyNode {
  id: string;
  name: string;
  subtext: string;
  category: 'source' | 'protocol' | 'destination' | 'asn';
  volume: string;
  rawBytes: number;
  severity: 'critical' | 'high' | 'medium' | 'safe';
  explanationKey?: string;
}

interface SankeyFlow {
  id: string;
  sourceId: string;
  protocolId: string;
  destId: string;
  asnId: string;
  volume: string;
  rawBytes: number;
  asymmetricRatio: string;
  severity: 'critical' | 'high' | 'medium';
  isAnomalous: boolean;
  explanationKey: string;
}

const SANKEY_NODES: Record<string, SankeyNode[]> = {
  sources: [
    { id: 'src-1', name: '10.0.1.50', subtext: 'WS-FINANCE-09 (Patient Zero)', category: 'source', volume: '56.6 MB', rawBytes: 56600000, severity: 'critical', explanationKey: 'exfiltration' },
    { id: 'src-2', name: '10.0.0.5', subtext: 'DC-PROD-01 (Domain Controller)', category: 'source', volume: '8.4 MB', rawBytes: 8400000, severity: 'high', explanationKey: 'c2-beacon' },
    { id: 'src-3', name: '10.0.2.15', subtext: 'DB-CORE-SQL (Classified DB)', category: 'source', volume: '14.2 MB', rawBytes: 14200000, severity: 'critical', explanationKey: 'exfiltration' },
    { id: 'src-4', name: '10.0.0.10', subtext: 'SSH-GATEWAY-01 (Bastion)', category: 'source', volume: '1.2 MB', rawBytes: 1200000, severity: 'medium', explanationKey: 'port-scan' }
  ],
  protocols: [
    { id: 'proto-https', name: 'HTTPS / 443', subtext: 'TLS 1.3 Asymmetric Upload', category: 'protocol', volume: '52.4 MB', rawBytes: 52400000, severity: 'critical', explanationKey: 'exfiltration' },
    { id: 'proto-c2', name: 'TLS / 8443', subtext: 'Cobalt Strike Encrypted Stream', category: 'protocol', volume: '14.2 MB', rawBytes: 14200000, severity: 'critical', explanationKey: 'c2-beacon' },
    { id: 'proto-dns', name: 'DNS / 53 TXT', subtext: 'Base64 Encoded Covert Tunnel', category: 'protocol', volume: '4.2 MB', rawBytes: 4200000, severity: 'critical', explanationKey: 'dns-tunnel' },
    { id: 'proto-ssh', name: 'SSH / 22 SCP', subtext: 'Encrypted Copy Transfer', category: 'protocol', volume: '9.6 MB', rawBytes: 9600000, severity: 'high', explanationKey: 'port-scan' }
  ],
  destinations: [
    { id: 'dst-1', name: '203.0.113.66', subtext: 'Exfil Staging Drop (Direct)', category: 'destination', volume: '52.4 MB', rawBytes: 52400000, severity: 'critical', explanationKey: 'exfiltration' },
    { id: 'dst-2', name: '198.51.100.44', subtext: 'Primary C2 Controller', category: 'destination', volume: '14.2 MB', rawBytes: 14200000, severity: 'critical', explanationKey: 'c2-beacon' },
    { id: 'dst-3', name: 'tunnel.evil.com', subtext: 'DNS Tunnel NS Endpoint', category: 'destination', volume: '4.2 MB', rawBytes: 4200000, severity: 'critical', explanationKey: 'dns-tunnel' },
    { id: 'dst-4', name: '185.220.101.5', subtext: 'Tor Anonymized Relay', category: 'destination', volume: '9.6 MB', rawBytes: 9600000, severity: 'high', explanationKey: 'exfiltration' }
  ],
  asns: [
    { id: 'asn-1', name: 'AS13335 (Cloudflare Proxy)', subtext: 'Suspicious Cloudflare Proxy Abuse', category: 'asn', volume: '52.4 MB', rawBytes: 52400000, severity: 'critical', explanationKey: 'exfiltration' },
    { id: 'asn-2', name: 'AS9009 (Bulletproof Host)', subtext: 'Known Malware Hosting Infrastructure', category: 'asn', volume: '14.2 MB', rawBytes: 14200000, severity: 'critical', explanationKey: 'c2-beacon' },
    { id: 'asn-3', name: 'AS15169 (Public Resolver)', subtext: 'Recursive DNS Query Redirection', category: 'asn', volume: '4.2 MB', rawBytes: 4200000, severity: 'high', explanationKey: 'dns-tunnel' },
    { id: 'asn-4', name: 'AS200052 (Tor Exit Node)', subtext: 'Encrypted Anonymity Darknet Router', category: 'asn', volume: '9.6 MB', rawBytes: 9600000, severity: 'high', explanationKey: 'exfiltration' }
  ]
};

const SANKEY_FLOWS: SankeyFlow[] = [
  {
    id: 'flow-1',
    sourceId: 'src-1',
    protocolId: 'proto-https',
    destId: 'dst-1',
    asnId: 'asn-1',
    volume: '52.4 MB',
    rawBytes: 52400000,
    asymmetricRatio: '43.2x (Upload Dominant)',
    severity: 'critical',
    isAnomalous: true,
    explanationKey: 'exfiltration'
  },
  {
    id: 'flow-2',
    sourceId: 'src-1',
    protocolId: 'proto-c2',
    destId: 'dst-2',
    asnId: 'asn-2',
    volume: '14.2 MB',
    rawBytes: 14200000,
    asymmetricRatio: '1.4x (Periodic Beaconing)',
    severity: 'critical',
    isAnomalous: true,
    explanationKey: 'c2-beacon'
  },
  {
    id: 'flow-3',
    sourceId: 'src-1',
    protocolId: 'proto-dns',
    destId: 'dst-3',
    asnId: 'asn-3',
    volume: '4.2 MB',
    rawBytes: 4200000,
    asymmetricRatio: '8.6x (Base64 TXT Tunnel)',
    severity: 'critical',
    isAnomalous: true,
    explanationKey: 'dns-tunnel'
  },
  {
    id: 'flow-4',
    sourceId: 'src-3',
    protocolId: 'proto-ssh',
    destId: 'dst-4',
    asnId: 'asn-4',
    volume: '9.6 MB',
    rawBytes: 9600000,
    asymmetricRatio: '19.5x (Classified DB Dump)',
    severity: 'high',
    isAnomalous: true,
    explanationKey: 'exfiltration'
  }
];

interface DataExfilSankeyProps {
  onSelectThreat?: (threat: ThreatExplanationData) => void;
}

export const DataExfilSankey: React.FC<DataExfilSankeyProps> = ({ onSelectThreat }) => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>('flow-1');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const activeFlow = SANKEY_FLOWS.find(f => f.id === selectedFlowId) || SANKEY_FLOWS[0];

  const handleInspect = (explanationKey: string) => {
    if (onSelectThreat) {
      const data = SAMPLE_EXPLANATIONS[explanationKey] || SAMPLE_EXPLANATIONS['exfiltration'];
      onSelectThreat(data);
    }
  };

  const getSeverityBadge = (severity: 'critical' | 'high' | 'medium' | 'safe') => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40 animate-pulse">CRITICAL</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFA726]/20 text-[#FFA726] border border-[#FFA726]/40">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">SAFE</span>;
    }
  };

  return (
    <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col gap-5 text-gray-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#00E5FF]/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#FF3B30]/10 border border-[#FF3B30]/30 text-[#FF3B30] shadow-[0_0_15px_rgba(255,59,48,0.2)]">
            <ShieldAlert size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">Data Exfiltration Flow Sankey Diagram</h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40 rounded">
                ASYMMETRIC OUTBOUND EGRESS
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Visualizing host-to-external drop flows across encrypted tunnels & cloud proxies (Zeek conn.log byte ratios)
            </p>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-[#050811] px-3 py-1.5 rounded-lg border border-[#00E5FF]/20 flex items-center gap-2">
            <HardDrive size={14} className="text-[#00E5FF]" />
            <span className="text-gray-400">Total Exfiltrated:</span>
            <span className="text-[#FF3B30] font-bold text-sm">80.4 MB</span>
          </div>
          <div className="bg-[#050811] px-3 py-1.5 rounded-lg border border-[#FFA726]/30 flex items-center gap-2">
            <Radio size={14} className="text-[#FFA726]" />
            <span className="text-gray-400">Upload Ratio:</span>
            <span className="text-[#FFA726] font-bold text-sm">43.2 : 1</span>
          </div>
        </div>
      </div>

      {/* Sankey Stage Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Column 1: Source Hosts */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1 border-b border-[#00E5FF]/10 pb-1">
            <span className="flex items-center gap-1.5 text-[#00E5FF] font-bold">
              <Cpu size={14} /> 1. INTERNAL SOURCE HOSTS
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {SANKEY_NODES.sources.map(node => {
              const isSelected = activeFlow.sourceId === node.id;
              const isHovered = hoveredNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    const flow = SANKEY_FLOWS.find(f => f.sourceId === node.id);
                    if (flow) setSelectedFlowId(flow.id);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#FF3B30]/15 border-[#FF3B30] shadow-[0_0_15px_rgba(255,59,48,0.3)]'
                      : isHovered
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50'
                      : 'bg-[#050811]/80 border-[#00E5FF]/15 hover:border-[#00E5FF]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-white">{node.name}</span>
                    {getSeverityBadge(node.severity)}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{node.subtext}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">Outbound:</span>
                    <span className="text-[#00E5FF] font-semibold">{node.volume}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FF3B30] shadow-[0_0_8px_#FF3B30]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Protocol / Port */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1 border-b border-[#00E5FF]/10 pb-1">
            <span className="flex items-center gap-1.5 text-[#00E5FF] font-bold">
              <Layers size={14} /> 2. PROTOCOL / EGRESS
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {SANKEY_NODES.protocols.map(node => {
              const isSelected = activeFlow.protocolId === node.id;
              const isHovered = hoveredNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    const flow = SANKEY_FLOWS.find(f => f.protocolId === node.id);
                    if (flow) setSelectedFlowId(flow.id);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#FFA726]/15 border-[#FFA726] shadow-[0_0_15px_rgba(255,167,38,0.3)]'
                      : isHovered
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50'
                      : 'bg-[#050811]/80 border-[#00E5FF]/15 hover:border-[#00E5FF]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-white">{node.name}</span>
                    {getSeverityBadge(node.severity)}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{node.subtext}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">Flow:</span>
                    <span className="text-[#FFA726] font-semibold">{node.volume}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FFA726] shadow-[0_0_8px_#FFA726]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Destination Host */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1 border-b border-[#00E5FF]/10 pb-1">
            <span className="flex items-center gap-1.5 text-[#00E5FF] font-bold">
              <ExternalLink size={14} /> 3. EXTERNAL TARGET
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {SANKEY_NODES.destinations.map(node => {
              const isSelected = activeFlow.destId === node.id;
              const isHovered = hoveredNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    const flow = SANKEY_FLOWS.find(f => f.destId === node.id);
                    if (flow) setSelectedFlowId(flow.id);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#FF3B30]/15 border-[#FF3B30] shadow-[0_0_15px_rgba(255,59,48,0.3)]'
                      : isHovered
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50'
                      : 'bg-[#050811]/80 border-[#00E5FF]/15 hover:border-[#00E5FF]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-white">{node.name}</span>
                    {getSeverityBadge(node.severity)}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{node.subtext}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">Received:</span>
                    <span className="text-[#FF3B30] font-semibold">{node.volume}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FF3B30] shadow-[0_0_8px_#FF3B30]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 4: Autonomous System (ASN) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1 border-b border-[#00E5FF]/10 pb-1">
            <span className="flex items-center gap-1.5 text-[#00E5FF] font-bold">
              <ShieldAlert size={14} /> 4. DESTINATION ASN / CLOUD
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {SANKEY_NODES.asns.map(node => {
              const isSelected = activeFlow.asnId === node.id;
              const isHovered = hoveredNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    const flow = SANKEY_FLOWS.find(f => f.asnId === node.id);
                    if (flow) setSelectedFlowId(flow.id);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#FF3B30]/15 border-[#FF3B30] shadow-[0_0_15px_rgba(255,59,48,0.3)]'
                      : isHovered
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50'
                      : 'bg-[#050811]/80 border-[#00E5FF]/15 hover:border-[#00E5FF]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-white truncate max-w-[150px]">{node.name}</span>
                    {getSeverityBadge(node.severity)}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{node.subtext}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">Aggregate:</span>
                    <span className="text-[#FF3B30] font-semibold">{node.volume}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FF3B30] shadow-[0_0_8px_#FF3B30]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Flow Forensic Detail Card */}
      <div className="bg-[#050811] border border-[#FF3B30]/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white">Active Exfiltration Stream:</span>
              <span className="text-xs font-mono text-[#FF3B30] font-bold">
                10.0.1.50 → HTTPS/443 → 203.0.113.66 ({activeFlow.volume})
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Traffic Asymmetry Ratio: <span className="text-[#FFA726] font-mono font-semibold">{activeFlow.asymmetricRatio}</span> • Passive Diode Detection
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button
            onClick={() => handleInspect(activeFlow.explanationKey)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#FF3B30]/20 hover:bg-[#FF3B30]/30 text-[#FF3B30] border border-[#FF3B30]/50 text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(255,59,48,0.2)]"
          >
            <span>Explain Alert (6-Pillars)</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
