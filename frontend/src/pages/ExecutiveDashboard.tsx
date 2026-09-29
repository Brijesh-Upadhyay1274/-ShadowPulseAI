import React, { useEffect, useState } from 'react';
import { 
  ExecutiveKpiGrid,
  HeroThreatGraph,
  NetworkTopology,
  AttackStoryTimeline,
  ProtocolActivityStream,
  ConfidenceDonut,
  ThreatHeatmapMatrix,
  ExplainabilityPanel,
  ThreatExplanationData,
  SAMPLE_EXPLANATIONS
} from '../components/soc-graphs';
import { fetchDashboardSummary } from '../api/client';
import { 
  Play, Pause, RotateCcw, Share2, Layers 
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>({
    totalThreats: 150,
    criticalAlerts: 10,
    highAlerts: 30,
    mediumAlerts: 60,
    lowAlerts: 50,
    activeC2: 8,
    exfiltrationEvents: 4
  });

  // Replay bar state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(33240); // 09:14:00 AM
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Active Center Visualization Mode
  const [centerView, setCenterView] = useState<'threat-graph' | 'topology'>('threat-graph');

  // Explainability Drawer
  const [selectedThreat, setSelectedThreat] = useState<ThreatExplanationData | null>(null);

  useEffect(() => {
    fetchDashboardSummary().then((res) => {
      if (res) setSummary(res);
    });
  }, []);

  // Replay timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec(prev => (prev + playbackSpeed * 60) % 86400);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const formatReplayTime = (sec: number) => {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs} UTC`;
  };

  return (
    <div className="flex flex-col gap-6 pb-12 font-sans">
      {/* CCTV-Style Attack Replay Bar */}
      <div className="bg-[#0B1020]/95 border border-[#00E5FF]/30 rounded-xl p-3.5 shadow-[0_0_25px_rgba(0,229,255,0.15)] backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#FF3B30]/20 border border-[#FF3B30]/40 text-[#FF3B30] font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-ping" />
            <span>CCTV FORENSIC REPLAY</span>
          </div>
          <div className="font-mono text-sm font-bold text-white tracking-wider">
            {formatReplayTime(currentTimeSec)}
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 min-w-[240px] max-w-xl flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-500">00:00</span>
          <input
            type="range"
            min={0}
            max={86400}
            step={60}
            value={currentTimeSec}
            onChange={(e) => setCurrentTimeSec(Number(e.target.value))}
            className="w-full h-1.5 bg-[#050811] rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
          />
          <span className="text-[10px] font-mono text-gray-500">23:59</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40 font-bold transition-all shadow-[0_0_10px_rgba(0,229,255,0.2)]"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            onClick={() => setCurrentTimeSec(0)}
            className="p-1.5 rounded-lg bg-[#050811] hover:bg-[#ffffff10] text-gray-400 hover:text-white border border-[#00E5FF]/20"
            title="Reset to 00:00"
          >
            <RotateCcw size={14} />
          </button>

          <div className="flex items-center bg-[#050811] rounded-lg border border-[#00E5FF]/20 p-0.5">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  playbackSpeed === speed
                    ? 'bg-[#00E5FF] text-[#050811]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Executive KPI Grid (#12) */}
      <ExecutiveKpiGrid 
        summary={summary} 
        onSelectKpiFilter={(filter) => {
          if (filter === 'c2') setSelectedThreat(SAMPLE_EXPLANATIONS['c2-beacon']);
          else if (filter === 'exfil') setSelectedThreat(SAMPLE_EXPLANATIONS['exfiltration']);
          else if (filter === 'critical') setSelectedThreat(SAMPLE_EXPLANATIONS['dns-tunnel']);
        }}
      />

      {/* Hero Visualizations Row: Threat Graph or Network Topology */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCenterView('threat-graph')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                centerView === 'threat-graph'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                  : 'bg-[#0B1020] text-gray-400 border border-[#00E5FF]/20 hover:text-white'
              }`}
            >
              <Share2 size={14} />
              <span>1. GLOBAL THREAT INTELLIGENCE GRAPH</span>
            </button>

            <button
              onClick={() => setCenterView('topology')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                centerView === 'topology'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                  : 'bg-[#0B1020] text-gray-400 border border-[#00E5FF]/20 hover:text-white'
              }`}
            >
              <Layers size={14} />
              <span>4. UNIDIRECTIONAL DIODE TOPOLOGY</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500">CLICK ANY NODE TO VIEW 6-PILLAR AI EXPLANATION</span>
          </div>
        </div>

        {centerView === 'threat-graph' ? (
          <HeroThreatGraph onSelectThreat={setSelectedThreat} />
        ) : (
          <NetworkTopology onSelectThreat={setSelectedThreat} />
        )}
      </div>

      {/* 2. Attack Story Timeline (#2) */}
      <AttackStoryTimeline onSelectThreat={setSelectedThreat} />

      {/* Split Row: Protocol Activity Stream (#7) & AI Confidence Donut (#6) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProtocolActivityStream onSelectThreat={setSelectedThreat} />
        </div>
        <div className="lg:col-span-1">
          <ConfidenceDonut onSelectThreat={setSelectedThreat} />
        </div>
      </div>

      {/* 5. Threat Heatmap Matrix (#5) */}
      <ThreatHeatmapMatrix onSelectThreat={setSelectedThreat} />

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

export default ExecutiveDashboard;
