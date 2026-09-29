import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { ThreatExplanationData, SAMPLE_EXPLANATIONS } from './ExplainabilityPanel';

const CATEGORIES = [
  'Reconnaissance (T1046)',
  'C2 Beaconing (T1071)',
  'DNS Abuse / DGA (T1568)',
  'Encrypted TLS JA3 (T1573)',
  'Data Exfiltration (T1048)'
];

const CATEGORY_KEYS = ['port-scan', 'c2-beacon', 'dns-tunnel', 'ja3-anomaly', 'exfiltration'];

const HOURS = Array.from({ length: 12 }, (_, i) => `${(i * 2).toString().padStart(2, '0')}:00`);

interface ThreatHeatmapMatrixProps {
  onSelectThreat?: (threat: ThreatExplanationData) => void;
}

export const ThreatHeatmapMatrix: React.FC<ThreatHeatmapMatrixProps> = ({ onSelectThreat }) => {
  const [hoveredCell, setHoveredCell] = useState<{ cat: string; hour: string; val: number; key: string } | null>(null);

  // Generate realistic threat matrix intensity values
  const matrixData = [
    [10, 15, 85, 92, 45, 20, 10, 12, 18, 30, 88, 65], // Recon (Peaks at 04:00, 20:00)
    [5, 8, 12, 94, 98, 96, 92, 95, 90, 85, 80, 75],   // C2 (Sustained active botnet)
    [0, 2, 5, 20, 85, 95, 60, 40, 30, 25, 10, 5],    // DNS Tunnel
    [0, 0, 0, 10, 30, 95, 98, 80, 50, 20, 5, 0],     // JA3 Malware
    [0, 0, 0, 0, 10, 25, 99, 92, 40, 10, 0, 0]       // Exfiltration (Peak at 12:00)
  ];

  const getCellColor = (val: number) => {
    if (val >= 85) return '#FF3B30'; // Critical Red
    if (val >= 60) return '#FFA726'; // High Orange
    if (val >= 35) return '#FFD600'; // Medium Yellow
    if (val >= 15) return '#00E5FF'; // Low Cyan
    return 'rgba(255, 255, 255, 0.04)'; // Safe Navy/Black
  };

  const handleCellClick = (key: string) => {
    if (onSelectThreat) {
      const data = SAMPLE_EXPLANATIONS[key] || SAMPLE_EXPLANATIONS['c2-beacon'];
      onSelectThreat(data);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 bg-[#0B1020]/90 flex flex-col justify-between font-mono select-none">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            5. THREAT CATEGORY TEMPORAL HEATMAP MATRIX
          </h4>
        </div>
        {hoveredCell ? (
          <span className="text-[11px] text-cyan-300 font-bold">
            {hoveredCell.cat.split(' ')[0]} @ {hoveredCell.hour} UTC: <span className="text-red-400">{hoveredCell.val}% INTENSITY</span> (Click to Explain)
          </span>
        ) : (
          <span className="text-[11px] text-gray-400">Hover/click cell for 6-pillar forensic metadata</span>
        )}
      </div>

      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Hour Headers */}
          <div className="flex ml-44 mb-2">
            {HOURS.map(h => (
              <div key={h} className="flex-1 text-center text-[10px] text-gray-500 font-bold">{h}</div>
            ))}
          </div>

          {/* Matrix Rows */}
          <div className="space-y-1.5">
            {CATEGORIES.map((cat, rowIdx) => {
              const catKey = CATEGORY_KEYS[rowIdx];
              return (
                <div key={cat} className="flex items-center gap-2">
                  <div className="w-42 text-[11px] text-gray-300 truncate font-semibold">{cat}</div>
                  <div className="flex flex-1 gap-1">
                    {matrixData[rowIdx].map((val, colIdx) => (
                      <div
                        key={colIdx}
                        onClick={() => handleCellClick(catKey)}
                        onMouseEnter={() => setHoveredCell({ cat, hour: HOURS[colIdx], val, key: catKey })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className="flex-1 h-7 rounded-sm transition-all duration-150 cursor-pointer hover:scale-110 hover:z-10 relative"
                        style={{
                          backgroundColor: getCellColor(val),
                          boxShadow: val >= 85 ? '0 0 10px rgba(255, 59, 48, 0.5)' : 'none',
                          opacity: val > 0 ? 0.9 : 0.4
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
        <span>TIME INTERVAL (24-HOUR MOVING WINDOW)</span>
        <div className="flex items-center gap-2">
          <span>SAFE</span>
          <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/10"></div>
          <div className="w-3 h-3 rounded-sm bg-[#00E5FF]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#FFD600]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#FFA726]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#FF3B30]"></div>
          <span className="text-red-400 font-bold">CRITICAL</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatHeatmapMatrix;
