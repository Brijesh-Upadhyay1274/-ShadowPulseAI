import React, { useState } from 'react';
import GlassCard from '../components/layout/GlassCard';
import ThreatIntelGraph from '../components/threat-graph/ThreatIntelGraph';
import { 
  Search, ShieldAlert, Server, Globe, Lock, AlertTriangle, 
  Database, RefreshCw, LayoutGrid, Download
} from 'lucide-react';

const ThreatGraph: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [layoutMode, setLayoutMode] = useState<'force' | 'radial' | 'tree'>('force');
  const [filters, setFilters] = useState({
    attacker: true,
    victim: true,
    domain: true,
    hash: true,
    alert: true,
    port: true
  });
  const [graphKey, setGraphKey] = useState(0);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetAllFilters = () => {
    setFilters({
      attacker: true,
      victim: true,
      domain: true,
      hash: true,
      alert: true,
      port: true
    });
    setSearchTerm('');
    setLayoutMode('force');
    setGraphKey(k => k + 1);
  };

  const handleExportSTIX = () => {
    const data = {
      type: "bundle",
      id: `bundle--${Date.now()}`,
      spec_version: "2.1",
      objects: [
        { type: "indicator", pattern: "[ipv4-addr:value = '198.51.100.44']", name: "Cobalt Strike C2 Node" },
        { type: "threat-actor", name: "APT29 (Nobelium)", confidence: 94 },
        { type: "attack-pattern", name: "Network Service Scanning", external_id: "T1046" }
      ]
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shadowpulse-threat-graph-stix2.1-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 pb-2">
      {/* Left Sidebar Filters */}
      <div className="w-80 flex flex-col gap-4 shrink-0 overflow-y-auto pr-1">
        <GlassCard title="Threat Intelligence Filters" className="flex-1 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Search within Graph */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Entity Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input 
                  type="text" 
                  placeholder="IP, Hash, Domain, Port..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0B1120] border border-[#ffffff1a] text-xs rounded-lg pl-8 pr-3 py-2 text-gray-200 outline-none focus:border-[#06B6D4] font-mono transition"
                />
              </div>
            </div>

            {/* Layout Mode Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <LayoutGrid size={14} className="text-cyan-400" /> TOPOLOGY ALGORITHM
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#0B1120] p-1 rounded-lg border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setLayoutMode('force')}
                  className={`py-1.5 px-2 rounded text-center transition ${
                    layoutMode === 'force' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Force
                </button>
                <button
                  onClick={() => setLayoutMode('radial')}
                  className={`py-1.5 px-2 rounded text-center transition ${
                    layoutMode === 'radial' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Concentric
                </button>
                <button
                  onClick={() => setLayoutMode('tree')}
                  className={`py-1.5 px-2 rounded text-center transition ${
                    layoutMode === 'tree' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Kill Tree
                </button>
              </div>
            </div>

            {/* Node Type Filters */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Entity Layers</h4>
                <button 
                  onClick={resetAllFilters}
                  className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={10} /> Reset
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <label className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] cursor-pointer transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444]"></span>
                    <ShieldAlert size={14} className="text-[#EF4444]" />
                    <span className="text-gray-200">Adversary C2 & Drops</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={filters.attacker} 
                    onChange={() => toggleFilter('attacker')}
                    className="accent-[#EF4444] w-4 h-4 cursor-pointer" 
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] cursor-pointer transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] shadow-[0_0_6px_#06B6D4]"></span>
                    <Server size={14} className="text-[#06B6D4]" />
                    <span className="text-gray-200">Internal Core Assets</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={filters.victim} 
                    onChange={() => toggleFilter('victim')}
                    className="accent-[#06B6D4] w-4 h-4 cursor-pointer" 
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] cursor-pointer transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
                    <Globe size={14} className="text-[#10B981]" />
                    <span className="text-gray-200">Domains & Tunnels</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={filters.domain} 
                    onChange={() => toggleFilter('domain')}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer" 
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] cursor-pointer transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-[0_0_6px_#A855F7]"></span>
                    <Lock size={14} className="text-[#A855F7]" />
                    <span className="text-gray-200">JA3 & Binary Hashes</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={filters.hash} 
                    onChange={() => toggleFilter('hash')}
                    className="accent-[#A855F7] w-4 h-4 cursor-pointer" 
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] cursor-pointer transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shadow-[0_0_6px_#F97316]"></span>
                    <AlertTriangle size={14} className="text-[#F97316]" />
                    <span className="text-gray-200">Incident Alert Nodes</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={filters.alert} 
                    onChange={() => toggleFilter('alert')}
                    className="accent-[#F97316] w-4 h-4 cursor-pointer" 
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] cursor-pointer transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]"></span>
                    <Database size={14} className="text-[#64748B]" />
                    <span className="text-gray-200">Target Ports</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={filters.port} 
                    onChange={() => toggleFilter('port')}
                    className="accent-[#64748B] w-4 h-4 cursor-pointer" 
                  />
                </label>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-[#ffffff12] pt-4 space-y-2">
              <button 
                onClick={handleExportSTIX}
                className="w-full py-2 bg-white/[0.05] hover:bg-white/10 text-gray-200 border border-white/10 rounded-lg font-mono text-xs transition flex justify-center items-center gap-2"
              >
                <Download size={14} className="text-cyan-400" /> EXPORT STIX 2.1 INTEL
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Main Force Graph Canvas */}
      <div className="flex-1 rounded-xl overflow-hidden border border-[#ffffff12] shadow-2xl relative bg-[#030712]">
        <ThreatIntelGraph key={`${graphKey}-${layoutMode}`} activeFilters={filters} searchTerm={searchTerm} layoutMode={layoutMode} />
      </div>
    </div>
  );
};

export default ThreatGraph;
