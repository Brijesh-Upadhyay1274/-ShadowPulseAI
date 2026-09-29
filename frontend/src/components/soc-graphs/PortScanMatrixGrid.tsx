import React, { useState } from 'react';
import { ShieldAlert, Crosshair, ArrowRight } from 'lucide-react';
import { ThreatExplanationData, SAMPLE_EXPLANATIONS } from './ExplainabilityPanel';

interface PortInfo {
  port: number;
  service: string;
  category: 'critical_service' | 'admin' | 'db' | 'web' | 'legacy';
}

interface ScannerProfile {
  ip: string;
  label: string;
  role: string;
  scanType: 'SYN Stealth Scan' | 'SSH Brute Force' | 'Horizontal Sweep' | 'Port Sweep';
  mitre: string;
  fanOutRatio: string;
  severity: 'critical' | 'high' | 'medium' | 'safe';
  explanationKey: string;
  hits: Record<number, number>; // port -> hit count
}

const MONITORED_PORTS: PortInfo[] = [
  { port: 21, service: 'FTP', category: 'legacy' },
  { port: 22, service: 'SSH', category: 'admin' },
  { port: 23, service: 'Telnet', category: 'legacy' },
  { port: 25, service: 'SMTP', category: 'legacy' },
  { port: 53, service: 'DNS', category: 'critical_service' },
  { port: 80, service: 'HTTP', category: 'web' },
  { port: 135, service: 'MSRPC', category: 'admin' },
  { port: 443, service: 'HTTPS', category: 'web' },
  { port: 445, service: 'SMB', category: 'admin' },
  { port: 1433, service: 'MSSQL', category: 'db' },
  { port: 3306, service: 'MySQL', category: 'db' },
  { port: 3389, service: 'RDP', category: 'admin' },
  { port: 8080, service: 'HTTP-Alt', category: 'web' },
  { port: 8443, service: 'TLS-C2', category: 'critical_service' }
];

const SCANNER_PROFILES: ScannerProfile[] = [
  {
    ip: '192.168.1.100',
    label: 'Host Sweep Bot',
    role: 'Internal Lateral Recon',
    scanType: 'Horizontal Sweep',
    mitre: 'T1046',
    fanOutRatio: '68 ports / min',
    severity: 'critical',
    explanationKey: 'port-scan',
    hits: {
      21: 45, 22: 92, 23: 38, 25: 12, 53: 18, 80: 84, 135: 64, 443: 79, 445: 120, 1433: 40, 3306: 35, 3389: 88, 8080: 52, 8443: 31
    }
  },
  {
    ip: '172.16.0.99',
    label: 'Perimeter Scanner',
    role: 'External Brute Forcer',
    scanType: 'SSH Brute Force',
    mitre: 'T1110',
    fanOutRatio: '32 attempts / min',
    severity: 'high',
    explanationKey: 'port-scan',
    hits: {
      21: 4, 22: 185, 23: 12, 25: 0, 53: 2, 80: 24, 135: 6, 443: 18, 445: 84, 1433: 8, 3306: 6, 3389: 142, 8080: 10, 8443: 15
    }
  },
  {
    ip: '185.220.101.5',
    label: 'Tor Exit Scanner',
    role: 'Anonymized Recon Node',
    scanType: 'SYN Stealth Scan',
    mitre: 'T1595',
    fanOutRatio: '45 ports / min',
    severity: 'high',
    explanationKey: 'port-scan',
    hits: {
      21: 18, 22: 42, 23: 20, 25: 5, 53: 8, 80: 64, 135: 22, 443: 58, 445: 35, 1433: 12, 3306: 18, 3389: 49, 8080: 62, 8443: 75
    }
  },
  {
    ip: '10.0.1.50',
    label: 'WS-FINANCE-09',
    role: 'Compromised Lateral Pivot',
    scanType: 'Port Sweep',
    mitre: 'T1046',
    fanOutRatio: '24 ports / min',
    severity: 'critical',
    explanationKey: 'c2-beacon',
    hits: {
      21: 0, 22: 14, 23: 0, 25: 0, 53: 45, 80: 12, 135: 88, 443: 160, 445: 140, 1433: 75, 3306: 82, 3389: 34, 8080: 28, 8443: 195
    }
  },
  {
    ip: '10.0.0.10',
    label: 'SSH Bastion',
    role: 'Authorized Management',
    scanType: 'SYN Stealth Scan',
    mitre: 'N/A',
    fanOutRatio: '1.2 ports / min',
    severity: 'safe',
    explanationKey: 'port-scan',
    hits: {
      21: 0, 22: 8, 23: 0, 25: 0, 53: 2, 80: 4, 135: 0, 443: 12, 445: 0, 1433: 0, 3306: 0, 3389: 2, 8080: 0, 8443: 0
    }
  }
];

interface PortScanMatrixGridProps {
  onSelectThreat?: (threat: ThreatExplanationData) => void;
}

export const PortScanMatrixGrid: React.FC<PortScanMatrixGridProps> = ({ onSelectThreat }) => {
  const [selectedCell, setSelectedCell] = useState<{
    scanner: ScannerProfile;
    port: PortInfo;
    hits: number;
  } | null>({
    scanner: SCANNER_PROFILES[0],
    port: MONITORED_PORTS[1], // SSH
    hits: SCANNER_PROFILES[0].hits[22]
  });

  const getHeatmapColor = (hits: number) => {
    if (hits === 0) return 'bg-[#0B1020] border-[#00E5FF]/10 text-gray-600';
    if (hits < 15) return 'bg-[#00E5FF]/15 border-[#00E5FF]/30 text-[#00E5FF]';
    if (hits < 50) return 'bg-[#FFA726]/30 border-[#FFA726]/60 text-[#FFA726] shadow-[0_0_8px_rgba(255,167,38,0.3)]';
    return 'bg-[#FF3B30]/40 border-[#FF3B30]/80 text-white font-bold shadow-[0_0_12px_rgba(255,59,48,0.5)]';
  };

  const handleInspect = (explanationKey: string) => {
    if (onSelectThreat) {
      const data = SAMPLE_EXPLANATIONS[explanationKey] || SAMPLE_EXPLANATIONS['port-scan'];
      onSelectThreat(data);
    }
  };

  return (
    <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col gap-5 text-gray-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#00E5FF]/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#FFA726]/10 border border-[#FFA726]/30 text-[#FFA726] shadow-[0_0_15px_rgba(255,167,38,0.2)]">
            <Crosshair size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">Port Probing Density Thermal Matrix</h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#FFA726]/20 text-[#FFA726] border border-[#FFA726]/40 rounded">
                HORIZONTAL & VERTICAL RECON
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Source IP connection attempts mapped against standard enterprise port vectors (Zeek conn.log REJ/S0 state ratios)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-gray-400">Probing Intensity:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#0B1020] border border-[#00E5FF]/20"></span>
            <span className="text-[10px] text-gray-500">0</span>
            <span className="w-3.5 h-3.5 rounded bg-[#00E5FF]/30 border border-[#00E5FF]"></span>
            <span className="text-[10px] text-[#00E5FF]">1-15</span>
            <span className="w-3.5 h-3.5 rounded bg-[#FFA726]/50 border border-[#FFA726]"></span>
            <span className="text-[10px] text-[#FFA726]">16-50</span>
            <span className="w-3.5 h-3.5 rounded bg-[#FF3B30]/70 border border-[#FF3B30] shadow-[0_0_8px_#FF3B30]"></span>
            <span className="text-[10px] text-[#FF3B30]">50+</span>
          </div>
        </div>
      </div>

      {/* Thermal Grid Matrix */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-xs font-mono text-gray-400 border-b border-[#00E5FF]/20 min-w-[200px]">
                SOURCE IP / HOST ROLE
              </th>
              {MONITORED_PORTS.map(p => (
                <th key={p.port} className="p-1.5 text-center border-b border-[#00E5FF]/20 min-w-[48px]">
                  <div className="font-mono text-xs font-bold text-[#00E5FF]">{p.port}</div>
                  <div className="text-[9px] text-gray-500 uppercase">{p.service}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCANNER_PROFILES.map(scanner => {
              const isSelected = selectedCell?.scanner.ip === scanner.ip;
              return (
                <tr 
                  key={scanner.ip}
                  className={`border-b border-[#00E5FF]/10 transition-colors ${
                    isSelected ? 'bg-[#00E5FF]/5' : 'hover:bg-[#00E5FF]/5'
                  }`}
                >
                  <td className="p-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        scanner.severity === 'critical' ? 'bg-[#FF3B30] shadow-[0_0_6px_#FF3B30]' :
                        scanner.severity === 'high' ? 'bg-[#FFA726]' :
                        scanner.severity === 'medium' ? 'bg-[#00E5FF]' : 'bg-emerald-500'
                      }`} />
                      <span className="font-mono text-xs font-bold text-white">{scanner.ip}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                      <span>{scanner.role}</span>
                      <span className="text-[10px] font-mono text-[#FFA726]">[{scanner.scanType}]</span>
                    </div>
                  </td>

                  {MONITORED_PORTS.map(port => {
                    const hits = scanner.hits[port.port] || 0;
                    const isCellActive = selectedCell?.scanner.ip === scanner.ip && selectedCell?.port.port === port.port;
                    return (
                      <td key={port.port} className="p-1 text-center">
                        <button
                          onClick={() => setSelectedCell({ scanner, port, hits })}
                          className={`w-10 h-10 rounded-md border flex items-center justify-center font-mono text-xs transition-all duration-150 relative ${
                            getHeatmapColor(hits)
                          } ${
                            isCellActive ? 'ring-2 ring-white scale-110 z-10' : 'hover:scale-105'
                          }`}
                        >
                          {hits > 0 ? hits : '-'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Cell Forensic Inspection Banner */}
      {selectedCell && (
        <div className="bg-[#050811] border border-[#FFA726]/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-[#FFA726]/20 text-[#FFA726] border border-[#FFA726]/40">
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs text-gray-400">Target Vector:</span>
                <span className="text-xs font-bold text-white">
                  Port {selectedCell.port.port} ({selectedCell.port.service})
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-xs text-gray-400">Probing Source:</span>
                <span className="text-xs font-bold text-[#FFA726]">{selectedCell.scanner.ip}</span>
                <span className="text-gray-500">•</span>
                <span className="text-xs text-[#FF3B30] font-bold">{selectedCell.hits} SYN/REJ Connections</span>
              </div>
              <div className="text-xs text-gray-400 mt-1 flex items-center gap-4">
                <span>Fan-out Rate: <strong className="text-white font-mono">{selectedCell.scanner.fanOutRatio}</strong></span>
                <span>MITRE Technique: <strong className="text-[#00E5FF] font-mono">{selectedCell.scanner.mitre}</strong></span>
                <span>Algorithm: <strong className="text-gray-300">Z-Score &gt; 2.5σ Anomaly</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleInspect(selectedCell.scanner.explanationKey)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#FFA726]/20 hover:bg-[#FFA726]/30 text-[#FFA726] border border-[#FFA726]/50 text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(255,167,38,0.2)] shrink-0 self-end md:self-center"
          >
            <span>Explain Alert (6-Pillars)</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PortScanMatrixGrid;
