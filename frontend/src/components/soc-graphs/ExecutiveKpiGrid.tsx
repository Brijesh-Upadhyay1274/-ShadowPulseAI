import React from 'react';
import { 
  ShieldAlert, Lock, Activity, Crosshair, HardDrive, 
  BrainCircuit, ArrowUpRight, CheckCircle2 
} from 'lucide-react';

interface ExecutiveKpiGridProps {
  summary?: {
    totalThreats?: number;
    criticalAlerts?: number;
    highAlerts?: number;
    mediumAlerts?: number;
    lowAlerts?: number;
    activeC2?: number;
    exfiltrationEvents?: number;
  };
  onSelectKpiFilter?: (filterType: string) => void;
}

export const ExecutiveKpiGrid: React.FC<ExecutiveKpiGridProps> = ({ 
  summary = {
    totalThreats: 150,
    criticalAlerts: 10,
    highAlerts: 30,
    mediumAlerts: 60,
    lowAlerts: 50,
    activeC2: 8,
    exfiltrationEvents: 4
  },
  onSelectKpiFilter
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* KPI 1: System Threat Readiness */}
      <div 
        onClick={() => onSelectKpiFilter && onSelectKpiFilter('critical')}
        className="bg-[#0B1020]/90 border border-[#FF3B30]/40 rounded-xl p-4 shadow-[0_0_20px_rgba(255,59,48,0.15)] backdrop-blur-md relative overflow-hidden group hover:border-[#FF3B30] transition-all cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF3B30]/10 rounded-full blur-xl group-hover:bg-[#FF3B30]/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">DEFCON POSTURE</span>
          <div className="p-1.5 rounded-lg bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40 animate-pulse">
            <ShieldAlert size={16} />
          </div>
        </div>
        <div className="text-xl font-mono font-bold text-white tracking-tight flex items-baseline gap-2">
          <span className="text-[#FF3B30]">DEFCON 2</span>
        </div>
        <div className="text-xs text-gray-400 font-mono mt-1 flex items-center justify-between">
          <span className="text-[#FF3B30] font-bold">{summary.criticalAlerts ?? 10} Critical Incidents</span>
          <span className="text-[10px] text-gray-500">SEV-1 ALERT</span>
        </div>
      </div>

      {/* KPI 2: Optical Data Diode Integrity */}
      <div className="bg-[#0B1020]/90 border border-[#00E5FF]/30 rounded-xl p-4 shadow-[0_0_20px_rgba(0,229,255,0.1)] backdrop-blur-md relative overflow-hidden group hover:border-[#00E5FF] transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E5FF]/10 rounded-full blur-xl group-hover:bg-[#00E5FF]/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">DIODE INTEGRITY</span>
          <div className="p-1.5 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
            <Lock size={16} />
          </div>
        </div>
        <div className="text-xl font-mono font-bold text-white tracking-tight flex items-baseline gap-2">
          <span className="text-[#00E5FF]">100% PASSIVE</span>
        </div>
        <div className="text-xs text-gray-400 font-mono mt-1 flex items-center justify-between">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 size={12} /> 0 TX Packets
          </span>
          <span className="text-[10px] text-gray-500">RX-ONLY TAP</span>
        </div>
      </div>

      {/* KPI 3: Total Passive Detections */}
      <div 
        onClick={() => onSelectKpiFilter && onSelectKpiFilter('all')}
        className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden group hover:border-[#00E5FF] transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">TOTAL DETECTIONS</span>
          <div className="p-1.5 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
            <Activity size={16} />
          </div>
        </div>
        <div className="text-xl font-mono font-bold text-white tracking-tight flex items-baseline gap-2">
          <span>{summary.totalThreats ?? 150}</span>
          <span className="text-xs font-normal text-gray-400">Events (24h)</span>
        </div>
        <div className="text-xs text-gray-400 font-mono mt-1 flex items-center justify-between">
          <span className="text-emerald-400 flex items-center gap-0.5 text-[11px]">
            <ArrowUpRight size={12} /> +18.4%
          </span>
          <span className="text-[10px] text-gray-500">vs 24h Baseline</span>
        </div>
      </div>

      {/* KPI 4: Active C2 Channels */}
      <div 
        onClick={() => onSelectKpiFilter && onSelectKpiFilter('c2')}
        className="bg-[#0B1020]/90 border border-[#FFA726]/40 rounded-xl p-4 shadow-[0_0_20px_rgba(255,167,38,0.15)] backdrop-blur-md relative overflow-hidden group hover:border-[#FFA726] transition-all cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFA726]/10 rounded-full blur-xl group-hover:bg-[#FFA726]/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">C2 BEACONS</span>
          <div className="p-1.5 rounded-lg bg-[#FFA726]/20 text-[#FFA726] border border-[#FFA726]/40 animate-pulse">
            <Crosshair size={16} />
          </div>
        </div>
        <div className="text-xl font-mono font-bold text-white tracking-tight flex items-baseline gap-2">
          <span className="text-[#FFA726]">{summary.activeC2 ?? 8} Active</span>
        </div>
        <div className="text-xs text-gray-400 font-mono mt-1 flex items-center justify-between">
          <span className="text-[#FFA726] font-bold">CV &lt; 0.30 IAT</span>
          <span className="text-[10px] text-gray-500">COBALT/METER</span>
        </div>
      </div>

      {/* KPI 5: Exfiltration Blocked & Egress Volume */}
      <div 
        onClick={() => onSelectKpiFilter && onSelectKpiFilter('exfil')}
        className="bg-[#0B1020]/90 border border-[#FF3B30]/30 rounded-xl p-4 shadow-[0_0_20px_rgba(255,59,48,0.1)] backdrop-blur-md relative overflow-hidden group hover:border-[#FF3B30] transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">DATA EXFILTRATION</span>
          <div className="p-1.5 rounded-lg bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40">
            <HardDrive size={16} />
          </div>
        </div>
        <div className="text-xl font-mono font-bold text-white tracking-tight flex items-baseline gap-2">
          <span className="text-[#FF3B30]">80.4 MB</span>
          <span className="text-xs font-normal text-gray-400">Flagged</span>
        </div>
        <div className="text-xs text-gray-400 font-mono mt-1 flex items-center justify-between">
          <span className="text-[#FF3B30] font-bold">4 Major Drops</span>
          <span className="text-[10px] text-gray-500">ASYMMETRIC</span>
        </div>
      </div>

      {/* KPI 6: AI Engine Fidelity & Accuracy */}
      <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-4 shadow-[0_0_20px_rgba(0,229,255,0.1)] backdrop-blur-md relative overflow-hidden group hover:border-[#00E5FF] transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">AI ACCURACY</span>
          <div className="p-1.5 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
            <BrainCircuit size={16} />
          </div>
        </div>
        <div className="text-xl font-mono font-bold text-white tracking-tight flex items-baseline gap-2">
          <span className="text-emerald-400">96.8%</span>
          <span className="text-xs font-normal text-gray-400">Confidence</span>
        </div>
        <div className="text-xs text-gray-400 font-mono mt-1 flex items-center justify-between">
          <span className="text-emerald-400 font-bold">0.02% FPR</span>
          <span className="text-[10px] text-gray-500">5 ENGINES</span>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveKpiGrid;
