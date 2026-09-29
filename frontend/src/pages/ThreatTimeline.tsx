import React, { useEffect, useState } from 'react';
import { 
  AttackStoryTimeline, 
  ExplainabilityPanel, 
  ThreatExplanationData, 
  SAMPLE_EXPLANATIONS 
} from '../components/soc-graphs';
import { fetchAlerts } from '../api/client';
import { Filter, Zap, ArrowRight } from 'lucide-react';

const formatTime = (ts: string | number) => {
  try {
    if (!ts) return '09:14:22 Z';
    const str = typeof ts === 'number' ? new Date(ts * 1000).toISOString() : String(ts);
    if (str.includes('T')) {
      const parts = str.split('T');
      const timePart = parts[1] ? parts[1].split('.')[0] : '09:14:22';
      return `${parts[0]} ${timePart} Z`;
    }
    return str;
  } catch {
    return '09:14:22 Z';
  }
};

export const ThreatTimeline: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedThreat, setSelectedThreat] = useState<ThreatExplanationData | null>(null);

  useEffect(() => {
    fetchAlerts().then((res) => {
      if (res && Array.isArray(res)) setAlerts(res);
    });
  }, []);

  const filtered = alerts.filter(a => 
    severityFilter === 'All' || (a.severity || '').toLowerCase() === severityFilter.toLowerCase()
  );

  const getExplanationForAlert = (alertType: string) => {
    const lower = (alertType || '').toLowerCase();
    if (lower.includes('beacon') || lower.includes('c2')) return SAMPLE_EXPLANATIONS['c2-beacon'];
    if (lower.includes('dns') || lower.includes('tunnel')) return SAMPLE_EXPLANATIONS['dns-tunnel'];
    if (lower.includes('exfil')) return SAMPLE_EXPLANATIONS['exfiltration'];
    if (lower.includes('ja3') || lower.includes('tls') || lower.includes('ssl')) return SAMPLE_EXPLANATIONS['ja3-anomaly'];
    return SAMPLE_EXPLANATIONS['port-scan'];
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-12 font-sans">
      {/* 1. MITRE Kill Chain Hero Timeline */}
      <AttackStoryTimeline onSelectThreat={setSelectedThreat} />

      {/* Filter Bar */}
      <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">FILTER BY SEVERITY:</span>
          <select 
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#050811] border border-[#00E5FF]/30 text-xs font-mono rounded-lg px-3 py-1.5 text-white outline-none focus:border-[#00E5FF]"
          >
            <option value="All">All Severities (Live Stream)</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF]">
          <Filter size={14} />
          <span>{filtered.length} Filtered Chronological Detections</span>
        </div>
      </div>

      {/* Chronological Event Feed */}
      <div className="relative pl-6 border-l-2 border-[#00E5FF]/30 flex-1 overflow-y-auto space-y-6 pb-6">
        {filtered.slice(0, 20).map((alert, i) => {
          const explanation = getExplanationForAlert(alert.type || alert.category);
          return (
            <div key={i} className="relative group">
              {/* Timeline Pin */}
              <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-[#050811] transition-transform group-hover:scale-125
                ${alert.severity === 'Critical' || alert.severity === 'critical' ? 'bg-[#FF3B30] shadow-[0_0_10px_#FF3B30]' : 
                  alert.severity === 'High' || alert.severity === 'high' ? 'bg-[#FFA726]' : 
                  alert.severity === 'Medium' || alert.severity === 'medium' ? 'bg-[#00E5FF]' : 'bg-emerald-400'}`}
              />
              
              <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md hover:border-[#00E5FF] transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider
                      ${alert.severity === 'Critical' || alert.severity === 'critical' ? 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40' : 
                        alert.severity === 'High' || alert.severity === 'high' ? 'bg-[#FFA726]/20 text-[#FFA726] border border-[#FFA726]/40' : 
                        'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'}`}
                    >
                      {alert.severity || 'Medium'}
                    </span>
                    <h4 className="text-base font-bold text-white tracking-wide">{alert.type || 'Port Scan'}</h4>
                  </div>
                  <span className="font-mono text-xs text-gray-400">{formatTime(alert.timestamp)}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                  <div className="bg-[#050811] p-3 rounded-lg border border-[#00E5FF]/15">
                    <div className="text-[10px] font-mono text-gray-500 mb-1">SOURCE (PROBING / ATTACKER)</div>
                    <div className="font-mono text-sm text-[#FF3B30] font-bold">{alert.source || '198.51.100.44'}</div>
                  </div>
                  <div className="bg-[#050811] p-3 rounded-lg border border-[#00E5FF]/15">
                    <div className="text-[10px] font-mono text-gray-500 mb-1">DESTINATION (INTERNAL VICTIM)</div>
                    <div className="font-mono text-sm text-[#00E5FF] font-bold">{alert.dest || '10.0.0.5:443'}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-400 border-t border-[#00E5FF]/15 pt-3">
                  <div className="flex items-center gap-4">
                    <div>MITRE ATT&CK: <span className="text-white font-bold">{alert.mitre || 'T1046'}</span></div>
                    <div>Engine: <span className="text-white">{alert.engine || 'Statistical Anomaly'}</span></div>
                    <div>Confidence: <span className="text-emerald-400 font-bold">{alert.confidence || 88}%</span></div>
                  </div>

                  <button
                    onClick={() => setSelectedThreat(explanation)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-bold transition-all"
                  >
                    <Zap size={13} />
                    <span>Explain Alert</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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

export default ThreatTimeline;
