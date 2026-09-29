import React, { useEffect, useState } from 'react';
import { fetchTopAttackers } from '../../api/client';

const TopAttackers: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchTopAttackers().then(setData);
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-gray-500 uppercase border-b border-[#ffffff12]">
          <tr>
            <th className="px-4 py-3 font-medium">Attacker IP</th>
            <th className="px-4 py-3 font-medium">Alerts</th>
            <th className="px-4 py-3 font-medium">Severity</th>
            <th className="px-4 py-3 font-medium">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-[#ffffff0a] hover:bg-[#ffffff05] transition-colors">
              <td className="px-4 py-3 font-mono text-gray-300">{row.ip}</td>
              <td className="px-4 py-3 text-gray-300">{row.count}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold
                  ${row.severity === 'Critical' ? 'bg-[#ef444422] text-[#EF4444]' : 
                    row.severity === 'High' ? 'bg-[#f9731622] text-[#F97316]' : 
                    row.severity === 'Medium' ? 'bg-[#f59e0b22] text-[#F59E0B]' : 
                    'bg-[#06b6d422] text-[#06B6D4]'}`}
                >
                  {row.severity}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="w-full bg-[#0B1120] rounded-full h-1.5 border border-[#ffffff12]">
                  <div className="bg-[#06B6D4] h-1.5 rounded-full" style={{ width: `${row.confidence}%` }}></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopAttackers;
