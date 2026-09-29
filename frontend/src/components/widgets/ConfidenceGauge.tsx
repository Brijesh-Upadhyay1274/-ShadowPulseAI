import React from 'react';

interface ConfidenceGaugeProps {
  value: number; // 0 to 100
  label?: string;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ value, label }) => {
  const getColor = (v: number) => {
    if (v >= 80) return '#EF4444';
    if (v >= 60) return '#F97316';
    if (v >= 40) return '#06B6D4';
    return '#10B981';
  };

  const color = getColor(value);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            cx="48" cy="48" r="36"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="48" cy="48" r="36"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono" style={{ color }}>{value}%</span>
        </div>
      </div>
      {label && <span className="text-xs text-gray-500 uppercase mt-2">{label}</span>}
    </div>
  );
};

export default ConfidenceGauge;
