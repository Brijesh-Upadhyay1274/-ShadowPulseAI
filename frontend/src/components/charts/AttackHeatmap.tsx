import React from 'react';

const AttackHeatmap: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate mock intensity data
  const data = days.map(() => hours.map(() => Math.floor(Math.random() * 100)));
  // Add some hotspots
  data[2][14] = 95; data[2][15] = 88; data[4][2] = 92;

  const getColor = (value: number) => {
    if (value > 80) return '#EF4444'; // Critical
    if (value > 60) return '#F97316'; // High
    if (value > 40) return '#F59E0B'; // Medium
    if (value > 20) return '#06B6D4'; // Low
    return 'rgba(255,255,255,0.05)'; // Safe
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex ml-8 mb-2">
          {hours.map(h => (
            <div key={h} className="flex-1 text-center text-[10px] text-gray-500">{h}h</div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {days.map((day, i) => (
            <div key={day} className="flex items-center gap-2">
              <div className="w-6 text-[10px] text-gray-400 text-right">{day}</div>
              <div className="flex flex-1 gap-1">
                {data[i].map((val, j) => (
                  <div 
                    key={j} 
                    className="flex-1 h-4 rounded-sm"
                    style={{ backgroundColor: getColor(val), opacity: val > 20 ? 0.8 + (val/500) : 1 }}
                    title={`${day} ${j}:00 - ${val} events`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end mt-4 gap-2 text-xs text-gray-400">
          <span>Low</span>
          <div className="w-3 h-3 rounded-sm bg-[rgba(255,255,255,0.05)]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#06B6D4]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#F59E0B]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#F97316]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#EF4444]"></div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default AttackHeatmap;
