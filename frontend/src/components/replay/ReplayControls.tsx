import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ShieldAlert, AlertTriangle } from 'lucide-react';

export interface IncidentMarker {
  percent: number;
  time: string;
  label: string;
  severity: 'critical' | 'high' | 'medium';
  type: string;
}

export const REPLAY_MARKERS: IncidentMarker[] = [
  { percent: 15, time: '09:14:22', label: 'TCP Port Scan (200+ ports)', severity: 'high', type: 'Recon' },
  { percent: 35, time: '09:22:10', label: 'C2 Periodic Beaconing (CV: 0.12)', severity: 'critical', type: 'C2' },
  { percent: 55, time: '09:26:15', label: 'DNS Tunneling & TXT Base64 Abuse', severity: 'critical', type: 'DNS' },
  { percent: 75, time: '09:30:00', label: 'Cobalt Strike JA3 Fingerprint Match', severity: 'critical', type: 'Malware' },
  { percent: 90, time: '09:35:22', label: '52.4MB Outbound Exfiltration Spike', severity: 'critical', type: 'Exfil' }
];

interface ReplayControlsProps {
  isPlaying: boolean;
  progress: number;
  speed: number;
  onTogglePlay: () => void;
  onSeek: (percent: number) => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  currentTimeStr: string;
}

const ReplayControls: React.FC<ReplayControlsProps> = ({
  isPlaying,
  progress,
  speed,
  onTogglePlay,
  onSeek,
  onSpeedChange,
  onReset,
  currentTimeStr
}) => {
  const speeds = [1, 2, 5, 10];

  const handleNextMarker = () => {
    const next = REPLAY_MARKERS.find(m => m.percent > progress + 1);
    if (next) onSeek(next.percent);
    else onSeek(100);
  };

  const handlePrevMarker = () => {
    const prev = [...REPLAY_MARKERS].reverse().find(m => m.percent < progress - 1);
    if (prev) onSeek(prev.percent);
    else onSeek(0);
  };

  return (
    <div className="glass-card rounded-xl p-4 flex flex-col gap-3.5 border border-white/10 shadow-2xl backdrop-blur-xl">
      {/* Upper Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onReset} 
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/10 text-gray-300 hover:text-white transition"
            title="Reset to Beginning (00:00)"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            onClick={handlePrevMarker} 
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/10 text-gray-300 hover:text-white transition"
            title="Jump to Previous Incident Marker"
          >
            <SkipBack size={18} />
          </button>
          
          <button 
            onClick={onTogglePlay}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isPlaying 
                ? 'bg-[#EF4444] text-white shadow-[0_0_16px_rgba(239,68,68,0.5)]' 
                : 'bg-[#06B6D4] text-[#050811] shadow-[0_0_16px_rgba(6,182,212,0.5)] hover:scale-105'
            }`}
            title={isPlaying ? "Pause Replay" : "Play Replay"}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>

          <button 
            onClick={handleNextMarker} 
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/10 text-gray-300 hover:text-white transition"
            title="Jump to Next Incident Marker"
          >
            <SkipForward size={18} />
          </button>

          <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>

          {/* Speed Multiplier Pill Selector */}
          <div className="flex items-center bg-[#0B1120] p-1 rounded-lg border border-white/10 gap-1 font-mono text-xs">
            {speeds.map(s => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded transition ${
                  speed === s 
                    ? 'bg-[#06B6D4] text-[#050811] font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Live Forensic Replay Clock HUD */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1120] border border-cyan-500/30 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-amber-400'}`}></span>
            <span className="text-gray-400">STATUS:</span>
            <span className={isPlaying ? 'text-red-400 font-bold' : 'text-amber-300'}>
              {isPlaying ? `REPLAYING (${speed}x)` : 'PAUSED'}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0B1120] border border-white/10 text-xs font-mono">
            <span className="text-cyan-400">PCAP TIME:</span>
            <span className="text-white font-bold tracking-wider">{currentTimeStr} UTC</span>
          </div>
        </div>
      </div>
      
      {/* Interactive Track Bar with Incident Pins */}
      <div className="relative pt-3 pb-1 select-none">
        {/* Track Bar Background */}
        <div className="h-2.5 bg-[#0B1120] rounded-full overflow-hidden border border-white/15 relative">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-red-500 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(6,182,212,0.5)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Clickable Marker Indicators along Track */}
        {REPLAY_MARKERS.map((m, idx) => (
          <button
            key={idx}
            onClick={() => onSeek(m.percent)}
            style={{ left: `${m.percent}%` }}
            className={`absolute top-1 transform -translate-x-1/2 group cursor-pointer transition hover:scale-125 z-10`}
            title={`[${m.time}] ${m.label}`}
          >
            <div className={`w-2.5 h-4.5 rounded-sm border ${
              m.severity === 'critical' 
                ? 'bg-red-500 border-red-300 shadow-[0_0_8px_#EF4444]' 
                : 'bg-orange-500 border-orange-300 shadow-[0_0_8px_#F97316]'
            }`}></div>
            
            {/* Hover Tooltip */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-[#0B1120] text-[11px] font-mono text-gray-200 px-2.5 py-1 rounded border border-white/20 whitespace-nowrap shadow-xl z-30">
              <span className="text-cyan-300 font-bold">{m.time}</span> • {m.label}
            </div>
          </button>
        ))}

        {/* Native Range Scrubber */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          step="0.2"
          value={progress}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
      </div>

      {/* Incident Quick Jump Badges Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mr-1">Jump to Phase:</span>
        {REPLAY_MARKERS.map((m, idx) => (
          <button
            key={idx}
            onClick={() => onSeek(m.percent)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition border ${
              progress >= m.percent 
                ? 'bg-white/10 text-gray-200 border-white/20 shadow-sm' 
                : 'bg-black/30 text-gray-500 border-white/5 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {m.severity === 'critical' ? (
              <ShieldAlert size={12} className="text-red-400" />
            ) : (
              <AlertTriangle size={12} className="text-orange-400" />
            )}
            <span className="font-semibold text-cyan-300">{m.type}</span>
            <span className="text-gray-400">({m.time})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReplayControls;
