import React, { useState, useEffect } from 'react';
import GlassCard from '../components/layout/GlassCard';
import ReplayControls from '../components/replay/ReplayControls';
import ThreatRadar from '../components/charts/ThreatRadar';
import { 
  ShieldAlert, Terminal, Download, Zap, 
  Activity, Clock, HardDrive, Wifi
} from 'lucide-react';

interface ReplayEvent {
  id: string;
  percent: number;
  time: string;
  source: string;
  dest: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  mitre: string;
  details: string;
  bytes: string;
  hex: string;
  phase: string;
}

const REPLAY_EVENTS: ReplayEvent[] = [
  {
    id: 'REP-01',
    percent: 15,
    time: '09:14:22',
    source: '192.168.1.100',
    dest: '10.0.0.5 (Multiple Ports)',
    type: 'TCP Port Scan & Host Discovery',
    severity: 'high',
    mitre: 'T1046 Network Service Scanning',
    details: 'Origin host scanned 220 unique ports in 30 seconds. Flagged with 88% confidence by Z-Score fan-out anomaly engine.',
    bytes: '8.8 KB (220 SYN pkts)',
    hex: '45 00 00 28 1c 46 40 00 40 06 b1 e6 c0 a8 01 64 0a 00 00 05 c3 50 00 16 00 00 00 00 50 02 72 10',
    phase: 'Reconnaissance'
  },
  {
    id: 'REP-02',
    percent: 35,
    time: '09:22:10',
    source: '10.0.1.50',
    dest: '198.51.100.44:8443',
    type: 'C2 Beacon Interval Established',
    severity: 'critical',
    mitre: 'T1071.001 Application Layer Protocol',
    details: 'Deterministic periodic callbacks observed. Inter-arrival time Coefficient of Variation (CV = 0.12) confirms automated C2 heartbeats.',
    bytes: '1.2 KB / heartbeat',
    hex: '45 00 00 34 2a 12 40 00 40 06 9f 11 0a 00 01 32 c6 33 64 2c e0 14 20 fb a1 20 44 91 80 18 01 f5',
    phase: 'C2 Establishment'
  },
  {
    id: 'REP-03',
    percent: 55,
    time: '09:26:15',
    source: '10.0.1.50',
    dest: '8.8.8.8:53 (tunnel.evil.com)',
    type: 'DNS Tunneling & TXT Base64 Covert Channel',
    severity: 'critical',
    mitre: 'T1572 Protocol Tunneling',
    details: 'High-entropy TXT queries exceeding 64 characters (Entropy: 4.22 bits). Base64 encoded payload decoded into system architecture reconnaissance.',
    bytes: '4.2 MB total DNS payload',
    hex: '24 1a 01 00 00 01 00 00 00 00 00 00 20 61 47 56 73 62 47 38 67 64 32 39 79 62 47 51 06 74 75 6e',
    phase: 'DNS Tunneling'
  },
  {
    id: 'REP-04',
    percent: 75,
    time: '09:30:00',
    source: '10.0.1.50',
    dest: '198.51.100.44:8443',
    type: 'Cobalt Strike Encrypted TLS Client Hello',
    severity: 'critical',
    mitre: 'T1573.002 Asymmetric Cryptography',
    details: 'Client Hello TLS handshake matches known Cobalt Strike JA3 fingerprint: 72a589da586844d7f0818ce684948eea. SNI mismatch verified.',
    bytes: '48.6 KB Handshake & Session',
    hex: '16 03 01 00 f5 01 00 00 f1 03 03 66 a1 22 b4 e1 90 28 44 11 88 92 a0 14 00 00 32 c0 2b c0 2f',
    phase: 'Encrypted Malware C2'
  },
  {
    id: 'REP-05',
    percent: 90,
    time: '09:35:22',
    source: '10.0.1.50',
    dest: '203.0.113.66:443',
    type: 'Data Exfiltration Spike (52.4 MB)',
    severity: 'critical',
    mitre: 'T1048 Exfiltration Over Alternative Protocol',
    details: 'Asymmetric upload ratio (42.8:1) to untrusted external destination. Sustained high-volume egress detected by IQR outlier engine.',
    bytes: '52,428,800 Bytes (52.4 MB)',
    hex: '17 03 03 40 00 1a f9 02 88 a1 c4 90 22 b5 e8 19 04 f2 77 12 80 44 91 22 00 14 aa 91 38 f5 00 19',
    phase: 'Data Exfiltration'
  }
];

const ReplayMode: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(40);
  const [speed, setSpeed] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<ReplayEvent>(REPLAY_EVENTS[1]);

  // Live Playback Loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return Math.min(100, prev + 0.3 * speed);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Compute Current Time String (Base 09:10:00 to 09:40:00 UTC)
  const totalSeconds = 30 * 60; // 30 minutes window
  const currentElapsedSec = Math.floor((progress / 100) * totalSeconds);
  const baseMinutes = 10 + Math.floor(currentElapsedSec / 60);
  const seconds = currentElapsedSec % 60;
  const currentTimeStr = `09:${baseMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Visible Events up to Current Scrubber Progress
  const visibleEvents = REPLAY_EVENTS.filter(e => e.percent <= progress);

  // Active Threat Level computation
  const isCriticalPhase = progress >= 35;
  const isElevatedPhase = progress >= 15;
  const packetsIngested = Math.floor(4500 + progress * 280);
  const exfilMB = progress >= 90 ? 52.4 : progress >= 55 ? 4.2 : 0.8;

  // Threat DNA at current point
  const currentDna = {
    recon: progress >= 15 ? 88 : 10,
    c2: progress >= 35 ? 92 : 0,
    dns: progress >= 55 ? 95 : 0,
    encrypted: progress >= 75 ? 90 : 0,
    exfil: progress >= 90 ? 98 : 0
  };

  return (
    <div className="h-full flex flex-col gap-6 pb-8">
      {/* Upper Replay Transport Bar */}
      <ReplayControls
        isPlaying={isPlaying}
        progress={progress}
        speed={speed}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onSeek={(p) => setProgress(p)}
        onSpeedChange={(s) => setSpeed(s)}
        onReset={() => { setProgress(0); setIsPlaying(false); }}
        currentTimeStr={currentTimeStr}
      />

      {/* Main Investigation Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left 7 Cols: Live Event Stream & Raw Forensic Packet Inspector */}
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-hidden">
          {/* Telemetry Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 shrink-0 font-mono">
            <div className="glass-card p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">DEFENSE STATUS</div>
              <div className={`text-sm font-bold mt-1 flex items-center gap-1.5 ${
                isCriticalPhase ? 'text-red-400 animate-pulse' : isElevatedPhase ? 'text-orange-400' : 'text-emerald-400'
              }`}>
                <ShieldAlert size={15} />
                {isCriticalPhase ? 'CRITICAL BREACH' : isElevatedPhase ? 'ACTIVE PROBING' : 'SECURE / NORMAL'}
              </div>
            </div>

            <div className="glass-card p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">PACKETS REPLAYED</div>
              <div className="text-sm font-bold text-cyan-300 mt-1 flex items-center gap-1.5">
                <Wifi size={15} />
                {packetsIngested.toLocaleString()}
              </div>
            </div>

            <div className="glass-card p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">DATA EGRESS</div>
              <div className="text-sm font-bold text-amber-300 mt-1 flex items-center gap-1.5">
                <HardDrive size={15} />
                {exfilMB} MB
              </div>
            </div>

            <div className="glass-card p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">ANOMALIES FLAGGED</div>
              <div className="text-sm font-bold text-red-400 mt-1 flex items-center gap-1.5">
                <Activity size={15} />
                {visibleEvents.length} INCIDENTS
              </div>
            </div>
          </div>

          {/* Chronological Event Stream */}
          <GlassCard 
            title={`Forensic Event Stream (${visibleEvents.length} Observed TTPs)`} 
            noPadding 
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {visibleEvents.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-gray-500 font-mono text-xs">
                  <Clock size={24} className="mb-2 opacity-50" />
                  <span>Scrub forward or press Play to begin observing network traffic...</span>
                </div>
              ) : (
                visibleEvents.map((evt) => {
                  const isSelected = selectedEvent?.id === evt.id;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500/60 shadow-[0_0_16px_rgba(6,182,212,0.2)]' 
                          : 'bg-[#0B1120]/70 border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            evt.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                          }`}>
                            {evt.severity}
                          </span>
                          <span className="text-cyan-300 font-bold">{evt.time} UTC</span>
                          <span className="text-gray-400 hidden sm:inline">• {evt.phase}</span>
                        </div>
                        <span className="text-gray-500 text-[11px] select-all">{evt.id}</span>
                      </div>

                      <div className="text-sm font-semibold text-white mb-1.5">{evt.type}</div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-400 mb-2">
                        <div><span className="text-gray-500">SRC:</span> <span className="text-red-400">{evt.source}</span></div>
                        <div><span className="text-gray-500">DST:</span> <span className="text-cyan-400">{evt.dest}</span></div>
                      </div>

                      <div className="text-xs text-gray-300 line-clamp-2">{evt.details}</div>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>

          {/* Selected Forensic Packet Payload Card */}
          {selectedEvent && (
            <GlassCard title={`Packet Forensic Inspector // ${selectedEvent.id}`} noPadding className="shrink-0 font-mono text-xs">
              <div className="p-4 space-y-3 bg-[#0B1120]/90">
                <div className="flex items-center justify-between">
                  <div className="text-gray-300">
                    <span className="text-gray-500">MITRE TACTIC:</span> <span className="text-cyan-400 font-bold">{selectedEvent.mitre}</span>
                  </div>
                  <span className="text-amber-400 font-bold">{selectedEvent.bytes}</span>
                </div>

                {/* Hex Dump */}
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Terminal size={12} /> RAW PACKET HEX DUMP (UNIDIRECTIONAL TAP CAPTURE)
                  </div>
                  <div className="bg-[#030712] p-2.5 rounded-lg border border-white/10 text-emerald-400 select-all font-mono text-[11px] overflow-x-auto">
                    {selectedEvent.hex}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition flex items-center gap-1.5">
                    <Download size={13} /> EXPORT PCAP SLICE
                  </button>
                  <button className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    <Zap size={13} /> ISOLATE THREAT ACTOR
                  </button>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right 5 Cols: Kill Chain Progression & Dynamic Threat DNA Radar */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-1">
          {/* Interactive Kill Chain Stepper */}
          <GlassCard title="Kill Chain Progression" className="shrink-0">
            <div className="space-y-3">
              {[
                { stage: '1. Reconnaissance', mitre: 'T1046', threshold: 15, name: 'TCP Port Scan & Fan-out Probe' },
                { stage: '2. C2 Establishment', mitre: 'T1071', threshold: 35, name: 'Periodic Outbound Beaconing' },
                { stage: '3. DNS Tunneling', mitre: 'T1572', threshold: 55, name: 'Base64 TXT Covert Exfil Pipe' },
                { stage: '4. Encrypted Malware', mitre: 'T1573', threshold: 75, name: 'Cobalt Strike JA3 Fingerprint' },
                { stage: '5. Data Exfiltration', mitre: 'T1048', threshold: 90, name: '52.4MB Bulk Data Transfer' }
              ].map((step, idx) => {
                const isReached = progress >= step.threshold;
                const isCurrent = isReached && (idx === 4 || progress < [35, 55, 75, 90, 101][idx]);

                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between font-mono text-xs ${
                      isCurrent 
                        ? 'bg-red-500/15 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.3)]' 
                        : isReached 
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-gray-300' 
                        : 'bg-black/20 border-white/5 opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        isCurrent 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : isReached 
                          ? 'bg-cyan-500 text-slate-950 font-bold' 
                          : 'bg-slate-800 text-gray-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className={`font-bold text-sm ${isCurrent ? 'text-red-400' : isReached ? 'text-white' : 'text-gray-500'}`}>
                          {step.stage}
                        </div>
                        <div className="text-[11px] text-gray-400">{step.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/10 text-cyan-300">
                        {step.mitre}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Dynamic Threat DNA Radar */}
          <GlassCard title="Behavioral Threat DNA at Timestamp" className="flex-1 flex flex-col justify-between">
            <div className="text-xs text-gray-400 mb-2 font-mono flex items-center justify-between">
              <span>REAL-TIME ATTRIBUTION:</span>
              <span className="text-red-400 font-bold">
                {progress >= 75 ? 'APT29 (COBALT STRIKE)' : progress >= 35 ? 'AUTOMATED BOTNET' : 'GENERIC RECON'}
              </span>
            </div>

            <ThreatRadar 
              dna={currentDna}
              coverage={{ recon: 60, c2: 85, dns: 80, encrypted: 75, exfil: 70 }}
            />

            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]"></span>
                <span className="text-gray-300">Active Threat DNA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#06B6D4]"></span>
                <span className="text-gray-300">Defense Capacity</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ReplayMode;
