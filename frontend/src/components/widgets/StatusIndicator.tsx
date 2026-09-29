import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'warning' | 'critical' | 'offline';
  label: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const getStyles = () => {
    switch (status) {
      case 'online': return { bg: 'bg-[#10B981]', text: 'text-[#10B981]', shadow: 'shadow-[0_0_8px_#10B981]', pulse: true };
      case 'warning': return { bg: 'bg-[#F97316]', text: 'text-[#F97316]', shadow: 'shadow-[0_0_8px_#F97316]', pulse: true };
      case 'critical': return { bg: 'bg-[#EF4444]', text: 'text-[#EF4444]', shadow: 'shadow-[0_0_8px_#EF4444]', pulse: true };
      case 'offline': return { bg: 'bg-gray-600', text: 'text-gray-400', shadow: '', pulse: false };
    }
  };

  const s = getStyles();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${s.bg} ${s.shadow} ${s.pulse ? 'animate-pulse-glow' : ''}`}></div>
      <span className={`text-xs uppercase tracking-wider font-semibold ${s.text}`}>{label}</span>
    </div>
  );
};

export default StatusIndicator;
