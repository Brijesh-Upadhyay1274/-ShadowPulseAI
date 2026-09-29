import React, { useEffect, useState } from 'react';
import { fetchAlerts } from '../api/client';
import { 
  ChevronDown, ChevronUp, Search, Zap, ArrowRight 
} from 'lucide-react';
import { 
  ExplainabilityPanel, 
  ThreatExplanationData, 
  SAMPLE_EXPLANATIONS 
} from '../components/soc-graphs';

const formatTime = (ts: string | number) => {
  try {
    if (!ts) return '09:14:22 Z';
    const str = typeof ts === 'number' ? new Date(ts * 1000).toISOString() : String(ts);
    if (str.includes('T')) {
      const timePart = str.split('T')[1];
      return (timePart ? timePart.split('.')[0] : '09:14:22') + ' Z';
    }
    return str;
  } catch {
    return '09:14:22 Z';
  }
};

export const AlertExplorer: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<ThreatExplanationData | null>(null);

  useEffect(() => {
    fetchAlerts().then((res) => {
      if (res && Array.isArray(res)) setAlerts(res);
    });
  }, []);

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = 
      (a.source || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.dest || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.mitre || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || (a.severity || '').toLowerCase() === severityFilter.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  const getExplanationForAlert = (alertType: string) => {
    const lower = (alertType || '').toLowerCase();
    if (lower.includes('beacon') || lower.includes('c2')) return SAMPLE_EXPLANATIONS['c2-beacon'];
    if (lower.includes('dns') || lower.includes('tunnel')) return SAMPLE_EXPLANATIONS['dns-tunnel'];
    if (lower.includes('exfil')) return SAMPLE_EXPLANATIONS['exfiltration'];
    if (lower.includes('ja3') || lower.includes('tls') || lower.includes('ssl')) return SAMPLE_EXPLANATIONS['ja3-anomaly'];
    return SAMPLE_EXPLANATIONS['port-scan'];
  };

  return (
    <div className="h-full flex flex-col gap-6 pb-12 font-sans">
      <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Filter by IP, Type, MITRE Tactic..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050811] border border-[#00E5FF]/20 text-xs rounded-lg pl-9 pr-4 py-2 text-white outline-none focus:border-[#00E5FF] font-mono"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={severityFilter} 
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#050811] border border-[#00E5FF]/20 text-xs font-mono rounded-lg px-3 py-2 text-gray-300 outline-none focus:border-[#00E5FF]"
          >
            <option value="All">Severity: All</option>
            <option value="Critical">Severity: Critical</option>
            <option value="High">Severity: High</option>
            <option value="Medium">Severity: Medium</option>
            <option value="Low">Severity: Low</option>
          </select>
          <span className="text-xs font-mono text-[#00E5FF]">
            {filteredAlerts.length} Active Records
          </span>
        </div>
      </div>

      <div className="bg-[#0B1020]/90 border border-[#00E5FF]/20 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#050811]/90 text-gray-400 uppercase sticky top-0 z-10 backdrop-blur-md font-mono border-b border-[#00E5FF]/20">
              <tr>
                <th className="px-4 py-3 font-medium">Time (UTC)</th>
                <th className="px-4 py-3 font-medium">Source (Actor)</th>
                <th className="px-4 py-3 font-medium">Destination (Victim)</th>
                <th className="px-4 py-3 font-medium">Threat Category</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Engine</th>
                <th className="px-4 py-3 font-medium">MITRE ATT&CK</th>
                <th className="px-4 py-3 font-medium">AI Confidence</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => {
                const explanation = getExplanationForAlert(alert.type || alert.category);
                return (
                  <React.Fragment key={alert.id}>
                    <tr 
                      className={`border-b border-[#00E5FF]/10 hover:bg-[#00E5FF]/5 cursor-pointer transition-colors ${expandedRow === alert.id ? 'bg-[#00E5FF]/10' : ''}`}
                      onClick={() => setExpandedRow(expandedRow === alert.id ? null : alert.id)}
                    >
                      <td className="px-4 py-3 font-mono text-gray-400">
                        {formatTime(alert.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#FF3B30] font-bold">{alert.source || '198.51.100.44'}</td>
                      <td className="px-4 py-3 font-mono text-[#00E5FF]">{alert.dest || '10.0.0.5:443'}</td>
                      <td className="px-4 py-3 text-white font-semibold">{alert.type || 'Port Scan'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider
                          ${alert.severity === 'Critical' || alert.severity === 'critical' ? 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40' : 
                            alert.severity === 'High' || alert.severity === 'high' ? 'bg-[#FFA726]/20 text-[#FFA726] border border-[#FFA726]/40' : 
                            'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'}`}
                        >
                          {alert.severity || 'Medium'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-400">{alert.engine || 'Statistical Engine'}</td>
                      <td className="px-4 py-3 font-mono text-[#00E5FF]">{alert.mitre || 'T1046'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-[#050811] rounded-full overflow-hidden border border-[#00E5FF]/20">
                            <div className="h-full bg-[#00E5FF]" style={{ width: `${alert.confidence || 85}%` }}></div>
                          </div>
                          <span className="text-xs text-emerald-400 font-mono font-bold">{alert.confidence || 85}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedThreat(explanation);
                          }}
                          className="px-2.5 py-1 rounded bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/50 text-[10px] font-mono font-bold transition-all shadow-[0_0_8px_rgba(0,229,255,0.2)] inline-flex items-center gap-1 mr-2"
                        >
                          <Zap size={11} />
                          <span>Explain 6-Pillars</span>
                        </button>
                        {expandedRow === alert.id ? <ChevronUp size={14} className="inline text-gray-400" /> : <ChevronDown size={14} className="inline text-gray-400" />}
                      </td>
                    </tr>

                    {expandedRow === alert.id && (
                      <tr className="bg-[#050811]/95 border-b border-[#00E5FF]/20">
                        <td colSpan={9} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2">Zeek Passive Log Record</div>
                              <div className="bg-[#0B1020] p-3 rounded font-mono text-[11px] text-[#00E5FF] border border-[#00E5FF]/20 max-h-32 overflow-y-auto leading-relaxed">
                                {explanation.zeekRawRecord}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2">AI Detection Reasoning</div>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {explanation.whyDetected}
                              </p>
                              <div className="mt-2 text-[10px] font-mono text-[#FFA726]">
                                Wazuh Rule {explanation.wazuhRuleId} (Level {explanation.wazuhRuleLevel})
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2">Forensic Actions</div>
                              <div className="flex flex-col gap-2">
                                <button 
                                  onClick={() => setSelectedThreat(explanation)}
                                  className="px-3 py-1.5 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 border border-[#00E5FF]/50 text-xs font-mono font-bold text-[#00E5FF] rounded transition-all flex items-center justify-between"
                                >
                                  <span>View Full 6-Pillar Evidence</span>
                                  <ArrowRight size={13} />
                                </button>
                                <button className="px-3 py-1.5 bg-[#FF3B30]/20 hover:bg-[#FF3B30]/30 border border-[#FF3B30]/50 text-xs font-mono font-bold text-[#FF3B30] rounded transition-all text-left">
                                  Mark Asset for Quarantine
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
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

export default AlertExplorer;
