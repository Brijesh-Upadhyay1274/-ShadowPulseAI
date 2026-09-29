import React from 'react';

interface ThreatCounterProps {
  label: string;
  value?: number;
  color?: 'red' | 'orange' | 'cyan' | 'green';
  icon?: React.ReactNode;
}

const ThreatCounter: React.FC<ThreatCounterProps> = ({ label, value = 0, color = 'cyan', icon }) => {
  const colors = {
    red: 'text-[#EF4444]',
    orange: 'text-[#F97316]',
    cyan: 'text-[#06B6D4]',
    green: 'text-[#10B981]'
  };

  const activeColor = colors[color] || colors.cyan;

  return (
    <div className="glass-card rounded-xl p-5 flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</div>
        <div className={`text-4xl font-mono font-bold ${activeColor}`}>
          {(value ?? 0).toLocaleString()}
        </div>
      </div>
      {icon && (
        <div className={`p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[#ffffff0a] ${activeColor}`}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default ThreatCounter;
