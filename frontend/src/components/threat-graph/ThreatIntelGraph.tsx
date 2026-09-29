import React, { useRef, useEffect, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  ZoomIn, ZoomOut, Maximize2, ShieldAlert, Lock, Globe, Server, Database, 
  AlertTriangle, Eye, X, Activity, Shield, Compass, Play, Pause
} from 'lucide-react';

export interface ThreatNode {
  id: string;
  shortLabel: string;
  fullLabel: string;
  type: 'attacker' | 'victim' | 'domain' | 'hash' | 'alert' | 'port';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'safe';
  val: number;
  ip?: string;
  asn?: string;
  role?: string;
  details?: string;
  mitre?: string;
  zone?: 'EXTERNAL' | 'DMZ' | 'INTERNAL_CORE';
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ThreatLink {
  source: any;
  target: any;
  relation: string;
  isMalicious?: boolean;
  bytes?: string;
}

interface ThreatIntelGraphProps {
  activeFilters?: {
    attacker: boolean;
    victim: boolean;
    domain: boolean;
    hash: boolean;
    alert: boolean;
    port: boolean;
  };
  searchTerm?: string;
  layoutMode?: 'force' | 'radial' | 'tree';
  onSelectThreat?: (threat: any) => void;
}

export const THREAT_GRAPH_NODES: ThreatNode[] = [
  // Adversaries (External)
  { id: '198.51.100.44', shortLabel: '198.51.100.44', fullLabel: '198.51.100.44 (CobaltStrike C2)', type: 'attacker', severity: 'critical', val: 16, ip: '198.51.100.44', asn: 'AS9009 (Bulletproof Hosting)', role: 'C2 Command Controller', mitre: 'T1071.001', zone: 'EXTERNAL' },
  { id: '203.0.113.66', shortLabel: '203.0.113.66', fullLabel: '203.0.113.66 (Exfil Drop)', type: 'attacker', severity: 'critical', val: 14, ip: '203.0.113.66', asn: 'AS13335 (Cloudflare Proxy)', role: 'Data Exfiltration Drop', mitre: 'T1048', zone: 'EXTERNAL' },
  { id: '172.16.0.99', shortLabel: '172.16.0.99', fullLabel: '172.16.0.99 (Recon Scanner)', type: 'attacker', severity: 'high', val: 12, ip: '172.16.0.99', asn: 'AS4134 (External Scanner)', role: 'Brute Force Probe', mitre: 'T1110', zone: 'EXTERNAL' },
  { id: '185.220.101.5', shortLabel: '185.220.101.5', fullLabel: '185.220.101.5 (Tor Exit)', type: 'attacker', severity: 'high', val: 12, ip: '185.220.101.5', asn: 'AS200052 (Tor Exit Node)', role: 'Anonymized Relay', mitre: 'T1090.003', zone: 'EXTERNAL' },
  { id: '192.168.1.100', shortLabel: '192.168.1.100', fullLabel: '192.168.1.100 (Host Sweep)', type: 'attacker', severity: 'medium', val: 10, ip: '192.168.1.100', asn: 'Subnet Prober', role: 'Infected Lateral Pivot', mitre: 'T1046', zone: 'EXTERNAL' },

  // Internal Core & Protected Assets
  { id: '10.0.0.5', shortLabel: 'DC-PROD-01', fullLabel: '10.0.0.5 (Domain Controller)', type: 'victim', severity: 'critical', val: 18, ip: '10.0.0.5', role: 'Primary Domain Controller', details: 'Windows Server 2022', zone: 'INTERNAL_CORE' },
  { id: '10.0.1.50', shortLabel: 'WS-FINANCE-09', fullLabel: '10.0.1.50 (Patient Zero Workstation)', type: 'victim', severity: 'critical', val: 16, ip: '10.0.1.50', role: 'Compromised Finance Endpoint', details: 'User: b.upadhyay', zone: 'INTERNAL_CORE' },
  { id: '10.0.0.10', shortLabel: 'SSH-GATEWAY-01', fullLabel: '10.0.0.10 (Bastion Host)', type: 'victim', severity: 'high', val: 13, ip: '10.0.0.10', role: 'Perimeter SSH Gateway', details: 'Ubuntu 24.04 LTS', zone: 'DMZ' },
  { id: '10.0.2.15', shortLabel: 'DB-CORE-SQL', fullLabel: '10.0.2.15 (Classified DB)', type: 'victim', severity: 'medium', val: 14, ip: '10.0.2.15', role: 'Government Records Database', details: 'PostgreSQL 16', zone: 'INTERNAL_CORE' },

  // Covert Infrastructure & Domains
  { id: 'tunnel.evil.com', shortLabel: 'tunnel.evil.com', fullLabel: 'tunnel.evil.com (DNS Tunnel)', type: 'domain', severity: 'critical', val: 13, role: 'Base64 TXT Covert Pipe', mitre: 'T1572', zone: 'DMZ' },
  { id: 'c2.malware.xyz', shortLabel: 'c2.malware.xyz', fullLabel: 'c2.malware.xyz (DGA Host)', type: 'domain', severity: 'critical', val: 13, role: 'DGA Generated C2 Host', mitre: 'T1568.002', zone: 'DMZ' },
  { id: 'update.evil.top', shortLabel: 'update.evil.top', fullLabel: 'update.evil.top (Phish CDN)', type: 'domain', severity: 'high', val: 11, role: 'Staging Payload Server', mitre: 'T1566', zone: 'DMZ' },

  // Cryptographic Artifacts & JA3 Hashes
  { id: '72a589da', shortLabel: 'JA3: CobaltStrike', fullLabel: 'JA3: 72a589da586844d7f0818ce684948eea', type: 'hash', severity: 'critical', val: 12, role: 'Cobalt Strike TLS Profile', mitre: 'T1573.002', zone: 'DMZ' },
  { id: 'a0e9f5d6', shortLabel: 'JA3: Meterpreter', fullLabel: 'JA3: a0e9f5d64349fb13191bc781f81f42e1', type: 'hash', severity: 'critical', val: 12, role: 'Metasploit TLS Profile', mitre: 'T1573.002', zone: 'DMZ' },
  { id: 'sha256:d8a4e912', shortLabel: 'Mimikatz Bin', fullLabel: 'SHA256: d8a4e912... (Mimikatz.exe)', type: 'hash', severity: 'critical', val: 11, role: 'Credential Dumper Artifact', mitre: 'T1003.001', zone: 'INTERNAL_CORE' },

  // Transport Ports & Listeners
  { id: 'port_8443', shortLabel: 'Port 8443/TCP', fullLabel: 'Port 8443/TCP (Encrypted C2)', type: 'port', severity: 'critical', val: 9, role: 'C2 Transport Port', zone: 'DMZ' },
  { id: 'port_22', shortLabel: 'Port 22/TCP', fullLabel: 'Port 22/TCP (SSH Admin)', type: 'port', severity: 'high', val: 9, role: 'Remote Management Port', zone: 'DMZ' },
  { id: 'port_53', shortLabel: 'Port 53/UDP', fullLabel: 'Port 53/UDP (DNS Transport)', type: 'port', severity: 'medium', val: 9, role: 'DNS Tunnel Transport', zone: 'DMZ' },
  { id: 'port_445', shortLabel: 'Port 445/TCP', fullLabel: 'Port 445/TCP (SMB Share)', type: 'port', severity: 'high', val: 9, role: 'Admin IPC$ Share', zone: 'INTERNAL_CORE' },

  // Active Detections / Incident Alerts
  { id: 'ALT-C2-BEACON', shortLabel: 'ALERT: C2 Beacon', fullLabel: 'ALERT: C2 Beacon (CV 0.12)', type: 'alert', severity: 'critical', val: 12, mitre: 'T1071', role: 'Periodic Check-in Detected', zone: 'DMZ' },
  { id: 'ALT-DNS-TUNNEL', shortLabel: 'ALERT: DNS Tunnel', fullLabel: 'ALERT: Base64 TXT DNS Tunnel', type: 'alert', severity: 'critical', val: 12, mitre: 'T1572', role: 'High Entropy TXT Abuse', zone: 'DMZ' },
  { id: 'ALT-EXFIL-SPIKE', shortLabel: 'ALERT: Exfiltration', fullLabel: 'ALERT: 52.4MB Outbound Spike', type: 'alert', severity: 'critical', val: 13, mitre: 'T1048', role: 'Asymmetric Data Egress', zone: 'EXTERNAL' },
  { id: 'ALT-SSH-BRUTE', shortLabel: 'ALERT: SSH Brute', fullLabel: 'ALERT: SSH Password Spray', type: 'alert', severity: 'high', val: 11, mitre: 'T1110', role: '15 Attempts / 60s', zone: 'DMZ' }
];

export const THREAT_GRAPH_LINKS: ThreatLink[] = [
  // C2 Channel
  { source: '10.0.1.50', target: '198.51.100.44', relation: 'C2_BEACONING', isMalicious: true, bytes: '128 KB/s' },
  { source: '198.51.100.44', target: '72a589da', relation: 'TLS_JA3_MATCH', isMalicious: true },
  { source: '198.51.100.44', target: 'port_8443', relation: 'LISTENS_ON', isMalicious: false },
  { source: '10.0.1.50', target: 'ALT-C2-BEACON', relation: 'TRIGGERED_ALERT', isMalicious: true },
  
  // DNS Tunnel & DGA
  { source: '10.0.1.50', target: 'tunnel.evil.com', relation: 'COVERT_TUNNEL', isMalicious: true, bytes: '4.2 MB' },
  { source: 'tunnel.evil.com', target: 'port_53', relation: 'RESOLVES_VIA', isMalicious: false },
  { source: 'tunnel.evil.com', target: 'ALT-DNS-TUNNEL', relation: 'TRIGGERED_ALERT', isMalicious: true },
  { source: '10.0.1.50', target: 'c2.malware.xyz', relation: 'DGA_QUERY', isMalicious: true },

  // Data Exfiltration Stream
  { source: '10.0.1.50', target: '203.0.113.66', relation: 'DATA_EXFILTRATION', isMalicious: true, bytes: '52.4 MB' },
  { source: '203.0.113.66', target: 'ALT-EXFIL-SPIKE', relation: 'TRIGGERED_ALERT', isMalicious: true },

  // Lateral Movement & Credential Access
  { source: '10.0.1.50', target: 'sha256:d8a4e912', relation: 'DROPPED_BINARY', isMalicious: true },
  { source: 'sha256:d8a4e912', target: '10.0.0.5', relation: 'PASS_THE_HASH', isMalicious: true },
  { source: '10.0.1.50', target: '10.0.0.5', relation: 'SMB_ADMIN_SHARE', isMalicious: true },
  { source: '10.0.0.5', target: 'port_445', relation: 'LISTENS_ON', isMalicious: false },

  // Reconnaissance & Perimeter
  { source: '172.16.0.99', target: '10.0.0.10', relation: 'SSH_BRUTE_FORCE', isMalicious: true, bytes: '30 conn/m' },
  { source: '10.0.0.10', target: 'port_22', relation: 'LISTENS_ON', isMalicious: false },
  { source: '172.16.0.99', target: 'ALT-SSH-BRUTE', relation: 'TRIGGERED_ALERT', isMalicious: true },
  { source: '185.220.101.5', target: '172.16.0.99', relation: 'TOR_CIRCUIT', isMalicious: true },
  { source: '192.168.1.100', target: '10.0.2.15', relation: 'SYN_PROBE', isMalicious: true },
  { source: '10.0.2.15', target: 'update.evil.top', relation: 'STAGED_PAYLOAD_REQ', isMalicious: true }
];

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#06B6D4',
  safe: '#10B981'
};

const TYPE_COLORS: Record<string, string> = {
  attacker: '#EF4444',
  victim: '#06B6D4',
  domain: '#10B981',
  hash: '#A855F7',
  alert: '#F97316',
  port: '#64748B'
};

const ThreatIntelGraph: React.FC<ThreatIntelGraphProps> = ({ 
  activeFilters = { attacker: true, victim: true, domain: true, hash: true, alert: true, port: true },
  searchTerm = '',
  layoutMode = 'force',
  onSelectThreat
}) => {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 540 });
  const [selectedNode, setSelectedNode] = useState<ThreatNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ThreatNode | null>(null);
  const [isSimulating, setIsSimulating] = useState(true);

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: Math.max(600, containerRef.current.clientWidth || 800),
          height: Math.max(480, containerRef.current.clientHeight || 540)
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Filter nodes & links
  const filteredNodes = THREAT_GRAPH_NODES.filter(node => {
    if (!activeFilters[node.type]) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        node.id.toLowerCase().includes(term) ||
        node.shortLabel.toLowerCase().includes(term) ||
        node.fullLabel.toLowerCase().includes(term) ||
        (node.role && node.role.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const nodeIds = new Set(filteredNodes.map(n => n.id));

  const filteredLinks = THREAT_GRAPH_LINKS.filter(link => {
    const src = typeof link.source === 'object' ? (link.source as any).id : link.source;
    const tgt = typeof link.target === 'object' ? (link.target as any).id : link.target;
    return nodeIds.has(src) && nodeIds.has(tgt);
  });

  // Calculate connected 1-hop neighbors for hover/selection highlighting
  const connectedNodeIds = new Set<string>();
  const activeFocusNode = selectedNode || hoveredNode;
  if (activeFocusNode) {
    connectedNodeIds.add(activeFocusNode.id);
    filteredLinks.forEach(l => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
      if (s === activeFocusNode.id) connectedNodeIds.add(t);
      if (t === activeFocusNode.id) connectedNodeIds.add(s);
    });
  }

  // Apply Strong d3 Physics Forces to avoid overlap and spread nodes gracefully
  useEffect(() => {
    if (fgRef.current) {
      const fg = fgRef.current;
      
      if (layoutMode === 'radial') {
        // Position in Concentric Rings
        filteredNodes.forEach((node, i) => {
          let r = 80;
          if (node.zone === 'INTERNAL_CORE') r = 70;
          else if (node.zone === 'DMZ') r = 160;
          else r = 260; // EXTERNAL

          const angle = (i / filteredNodes.length) * 2 * Math.PI;
          node.fx = Math.cos(angle) * r;
          node.fy = Math.sin(angle) * r;
        });
      } else if (layoutMode === 'tree') {
        // Hierarchical Attack Tree
        filteredNodes.forEach((node) => {
          if (node.zone === 'EXTERNAL') node.fx = -240 + (Math.random() * 40 - 20);
          else if (node.zone === 'DMZ') node.fx = 0 + (Math.random() * 40 - 20);
          else node.fx = 240 + (Math.random() * 40 - 20);
          node.fy = (Math.random() * 320) - 160;
        });
      } else {
        // Natural Force-Directed (Release manual pins)
        filteredNodes.forEach(node => {
          node.fx = null;
          node.fy = null;
        });
      }

      // Configure D3 Repulsion, Collision & Link Spacing
      fg.d3Force('charge')?.strength(-520);
      fg.d3Force('link')?.distance(140);
      fg.d3Force('center')?.strength(0.08);

      // Re-heat simulation
      fg.d3ReheatSimulation();
      
      // Auto fit to screen nicely
      setTimeout(() => {
        fg.zoomToFit(500, 60);
      }, 400);
    }
  }, [layoutMode, filteredNodes.length]);

  // High-Performance Military-Grade Canvas Painting
  const handleNodePaint = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { x, y, type, severity, shortLabel, fullLabel } = node;
    const baseColor = TYPE_COLORS[type] || '#64748B';
    const sevColor = SEVERITY_COLORS[severity] || baseColor;
    const radius = Math.max(7, (node.val || 12) * 0.7);

    const isSelected = selectedNode?.id === node.id;
    const isHovered = hoveredNode?.id === node.id;
    const isFocused = isSelected || isHovered;
    const isDimmed = activeFocusNode && !connectedNodeIds.has(node.id);

    ctx.save();
    if (isDimmed) {
      ctx.globalAlpha = 0.15;
    }

    // 1. Glowing Radar Halo for Critical / Focused Nodes
    if ((severity === 'critical' || isFocused) && !isDimmed) {
      ctx.beginPath();
      ctx.arc(x, y, radius + (isFocused ? 10 : 5), 0, 2 * Math.PI, false);
      const gradient = ctx.createRadialGradient(x, y, radius, x, y, radius + (isFocused ? 10 : 5));
      gradient.addColorStop(0, severity === 'critical' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(6, 182, 212, 0.45)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // 2. Dark Armor Shell
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#050811';
    ctx.fill();
    ctx.lineWidth = isFocused ? 3 / globalScale : 2 / globalScale;
    ctx.strokeStyle = isFocused ? '#FFFFFF' : sevColor;
    ctx.stroke();

    // 3. Tactical Inner Core
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.45, 0, 2 * Math.PI, false);
    ctx.fillStyle = baseColor;
    ctx.fill();

    // 4. Compact Non-Overlapping Label Rendering (Adaptive Level-of-Detail)
    const labelText = isFocused ? fullLabel : shortLabel;
    const fontSize = Math.max(9 / globalScale, 3.5);
    ctx.font = `${isFocused ? 'bold ' : ''}${fontSize}px 'JetBrains Mono', monospace`;
    const textWidth = ctx.measureText(labelText).width;
    const pillHeight = fontSize + 4;
    const pillY = y + radius + 3;

    // Background pill
    ctx.fillStyle = isFocused ? 'rgba(6, 182, 212, 0.95)' : 'rgba(11, 17, 32, 0.85)';
    ctx.fillRect(x - textWidth / 2 - 3, pillY, textWidth + 6, pillHeight);
    
    ctx.strokeStyle = isFocused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1 / globalScale;
    ctx.strokeRect(x - textWidth / 2 - 3, pillY, textWidth + 6, pillHeight);

    // Text label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isFocused ? '#050811' : '#E2E8F0';
    ctx.fillText(labelText, x, pillY + pillHeight / 2);

    ctx.restore();
  }, [selectedNode, hoveredNode, activeFocusNode, connectedNodeIds]);

  return (
    <div className="w-full h-[540px] relative bg-[#030712] rounded-xl overflow-hidden select-none border border-[#00E5FF]/20 shadow-2xl" ref={containerRef}>
      {/* Background Tactical Grid & Watermark */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Top Left Status & Sector Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
        <span className="px-3 py-1.5 text-xs font-mono font-bold bg-[#0B1120]/90 text-cyan-400 border border-cyan-500/40 rounded-lg backdrop-blur-md shadow-xl flex items-center gap-2">
          <Activity size={14} className="animate-pulse text-cyan-400" />
          NTRO TOPOLOGY // {filteredNodes.length} NODES • {filteredLinks.length} EDGES
        </span>

        <span className="px-2.5 py-1 text-[11px] font-mono bg-[#0B1120]/80 text-gray-300 border border-white/10 rounded-lg hidden sm:flex items-center gap-1.5">
          <Compass size={12} className="text-amber-400" />
          LAYOUT: <span className="text-white font-bold uppercase">{layoutMode}</span>
        </span>
      </div>

      {/* Top Right Tactical Control Strip */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#0B1120]/90 border border-white/10 rounded-lg p-1 backdrop-blur-md shadow-xl">
        <button
          onClick={() => {
            if (isSimulating) fgRef.current?.pauseAnimation();
            else fgRef.current?.resumeAnimation();
            setIsSimulating(!isSimulating);
          }}
          className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition font-mono text-xs flex items-center gap-1"
          title={isSimulating ? "Freeze Physics" : "Unfreeze Physics"}
        >
          {isSimulating ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <div className="h-4 w-[1px] bg-white/10"></div>

        <button
          onClick={() => fgRef.current?.zoom(fgRef.current.zoom() * 1.3, 300)}
          className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition"
          title="Zoom In"
        >
          <ZoomIn size={15} />
        </button>
        <button
          onClick={() => fgRef.current?.zoom(fgRef.current.zoom() / 1.3, 300)}
          className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition"
          title="Zoom Out"
        >
          <ZoomOut size={15} />
        </button>
        <button
          onClick={() => fgRef.current?.zoomToFit(400, 60)}
          className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-white/10 rounded transition font-mono text-xs flex items-center gap-1"
          title="Fit & Center All Nodes"
        >
          <Maximize2 size={14} />
          <span>FIT</span>
        </button>
      </div>

      {/* Bottom Left Government Clearance Watermark */}
      <div className="absolute bottom-3 left-3 z-10 text-[10px] font-mono text-gray-500 pointer-events-none flex items-center gap-2">
        <Shield size={12} className="text-cyan-500" />
        <span>NTRO PASSIVE INTEL // UNIDIRECTIONAL TAP REPLAY // CLASSIFIED TOPOLOGY</span>
      </div>

      {/* Interactive Floating Dossier Inspector Card */}
      {selectedNode && (
        <div className="absolute top-14 right-3 z-20 w-84 p-4 bg-[#0B1120]/95 border border-cyan-500/50 rounded-xl backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] text-xs font-mono animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex justify-between items-start mb-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              {selectedNode.type === 'attacker' && <ShieldAlert size={16} className="text-red-400" />}
              {selectedNode.type === 'victim' && <Server size={16} className="text-cyan-400" />}
              {selectedNode.type === 'domain' && <Globe size={16} className="text-emerald-400" />}
              {selectedNode.type === 'hash' && <Lock size={16} className="text-purple-400" />}
              {selectedNode.type === 'alert' && <AlertTriangle size={16} className="text-orange-400" />}
              {selectedNode.type === 'port' && <Database size={16} className="text-slate-400" />}
              <span className="font-bold text-white uppercase">{selectedNode.type} DOSSIER</span>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white p-0.5">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2 text-gray-300">
            <div><span className="text-gray-500">IDENTIFIER:</span> <span className="text-white font-bold select-all">{selectedNode.id}</span></div>
            <div><span className="text-gray-500">ROLE:</span> <span className="text-cyan-300">{selectedNode.role || 'Network Asset'}</span></div>
            {selectedNode.asn && <div><span className="text-gray-500">ASN / ORIGIN:</span> <span className="text-yellow-400">{selectedNode.asn}</span></div>}
            {selectedNode.mitre && <div><span className="text-gray-500">MITRE TECHNIQUE:</span> <span className="text-orange-400 font-bold">{selectedNode.mitre}</span></div>}
            {selectedNode.details && <div><span className="text-gray-500">SYSTEM:</span> <span className="text-gray-300">{selectedNode.details}</span></div>}
            <div>
              <span className="text-gray-500">THREAT SEVERITY:</span>{' '}
              <span 
                className="font-bold uppercase px-2 py-0.5 rounded text-[10px]"
                style={{
                  backgroundColor: `${SEVERITY_COLORS[selectedNode.severity]}22`,
                  color: SEVERITY_COLORS[selectedNode.severity],
                  border: `1px solid ${SEVERITY_COLORS[selectedNode.severity]}44`
                }}
              >
                {selectedNode.severity}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
            {onSelectThreat && (
              <button 
                onClick={() => onSelectThreat({
                  id: selectedNode.id,
                  title: `${selectedNode.fullLabel} Forensics`,
                  category: selectedNode.type.toUpperCase(),
                  severity: selectedNode.severity,
                  confidence: 94,
                  mitreId: selectedNode.mitre || 'T1071',
                  mitreTactic: 'Command and Control / Recon',
                  mitreTechnique: selectedNode.role || 'Unidirectional Network Anomaly',
                  whyDetected: `Adversary entity ${selectedNode.id} was identified via passive unidirectional metadata stream analysis.`,
                  metadataTrigger: [
                    { key: 'Target Node', value: selectedNode.id, threshold: 'Untrusted IOC', deviation: 'Active Threat' },
                    { key: 'Zone', value: selectedNode.zone || 'EXTERNAL', threshold: 'Classified Core', deviation: 'Breach Vector' }
                  ],
                  zeekLogType: 'conn.log',
                  zeekRawRecord: `1727510400.100\tC_NODE\t${selectedNode.id}\t443\t10.0.0.5\t8443\ttcp\tssl\t1.5\t2048\t4096\tSF\tT\tF\t0\tShADadFf\t10\t800\t8\t640\t-`,
                  wazuhRuleId: '100520',
                  wazuhRuleLevel: 10,
                  wazuhRuleDescription: `ShadowPulse SIEM: Threat activity attributed to ${selectedNode.id}`,
                  n8nWorkflowName: 'ShadowPulse — Entity Graph Node Threat Enrichment',
                  n8nActionTaken: 'Flagged entity across all SOC dashboards and generated forensic dossier.',
                  confidenceFactors: [
                    { factor: 'Topology Graph Correlation', weight: '35%', score: 96 },
                    { factor: 'Passive Sensor Telemetry', weight: '35%', score: 94 },
                    { factor: 'MITRE ATT&CK Mapping', weight: '30%', score: 92 }
                  ]
                })}
                className="w-full py-1.5 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/50 rounded font-bold transition flex justify-center items-center gap-1.5 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
              >
                <Eye size={14} /> EXPLAIN ENTITY (6-PILLARS)
              </button>
            )}
            {selectedNode.type === 'attacker' ? (
              <button className="w-full py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/50 rounded font-bold transition flex justify-center items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                <ShieldAlert size={14} /> BLOCK IOC AT FIREWALL
              </button>
            ) : selectedNode.type === 'victim' ? (
              <button className="w-full py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/50 rounded font-bold transition flex justify-center items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Lock size={14} /> ISOLATE COMPROMISED ASSET
              </button>
            ) : (
              <button className="w-full py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/50 rounded font-bold transition flex justify-center items-center gap-1.5">
                <Eye size={14} /> QUERY THREAT INTEL DATABASE
              </button>
            )}
          </div>
        </div>
      )}

      {/* D3 Force-Directed Canvas */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={{ nodes: filteredNodes, links: filteredLinks }}
        backgroundColor="#030712"
        nodeCanvasObject={handleNodePaint}
        nodePointerAreaPaint={(node: any, color, ctx) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 16, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        // Malicious Particle Streaming
        linkDirectionalParticles={(link: any) => (link.isMalicious ? 4 : 0)}
        linkDirectionalParticleWidth={2.5}
        linkDirectionalParticleSpeed={0.007}
        linkDirectionalParticleColor={() => '#EF4444'}
        linkColor={(link: any) => {
          const s = typeof link.source === 'object' ? link.source.id : link.source;
          const t = typeof link.target === 'object' ? link.target.id : link.target;
          if (activeFocusNode && !connectedNodeIds.has(s) && !connectedNodeIds.has(t)) {
            return 'rgba(255, 255, 255, 0.03)';
          }
          return link.isMalicious ? 'rgba(239, 68, 68, 0.5)' : 'rgba(100, 116, 139, 0.25)';
        }}
        linkWidth={(link: any) => (link.isMalicious ? 2 : 1)}
        linkLabel={(link: any) => `
          <div style="background:#0F172A;padding:4px 8px;border-radius:4px;border:1px solid rgba(255,255,255,0.1);font-family:monospace;font-size:11px;color:#FFF">
            <span style="color:${link.isMalicious ? '#EF4444' : '#06B6D4'}">${link.relation}</span>
            ${link.bytes ? `<span style="color:#94A3B8"> (${link.bytes})</span>` : ''}
          </div>
        `}
        onNodeClick={(node: any) => {
          setSelectedNode(node);
          if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 400);
            fgRef.current.zoom(2.0, 400);
          }
        }}
        onNodeHover={(node: any) => setHoveredNode(node)}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTicks={120}
      />
    </div>
  );
};

export default ThreatIntelGraph;
