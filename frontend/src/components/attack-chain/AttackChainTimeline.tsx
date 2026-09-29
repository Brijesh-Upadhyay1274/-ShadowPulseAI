import React from 'react';
import { ShieldAlert, Download, Zap } from 'lucide-react';

const AttackChainTimeline: React.FC = () => {
  const steps = [
    { phase: 'Reconnaissance', desc: 'Port scan detected (T1046)', time: '10:02:45 Z', status: 'done', severity: 'low' },
    { phase: 'C2 Establishment', desc: 'Beacon established (T1071)', time: '10:15:12 Z', status: 'done', severity: 'high' },
    { phase: 'DNS Tunneling', desc: 'Covert channel (T1572)', time: '10:22:05 Z', status: 'done', severity: 'high' },
    { phase: 'Encrypted C2', desc: 'Malware comms (T1573)', time: '10:45:30 Z', status: 'active', severity: 'critical' },
    { phase: 'Exfiltration', desc: 'Data theft (T1041)', time: 'Pending', status: 'pending', severity: 'critical' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper */}
      <div className="flex items-center justify-between relative px-4">
        <div className="absolute left-0 right-0 h-0.5 bg-[#ffffff12] top-1/2 -translate-y-1/2 z-0"></div>
        {steps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs
              ${step.status === 'done' ? 'bg-[#0B1120] border-[#EF4444] text-[#EF4444]' : 
                step.status === 'active' ? 'bg-[#EF4444] border-[#EF4444] text-white animate-pulse-glow' : 
                'bg-[#0B1120] border-gray-600 text-gray-500'}
            `}>
              {idx + 1}
            </div>
            <div className={`text-xs ${step.status === 'pending' ? 'text-gray-500' : 'text-gray-300'}`}>{step.phase}</div>
          </div>
        ))}
      </div>

      {/* Detail Cards */}
      <div className="space-y-4 mt-4">
        {steps.filter(s => s.status !== 'pending').map((step, idx) => (
          <div key={idx} className="glass-card p-4 rounded-lg border-l-4 border-l-[#EF4444]">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-[#EF4444]" />
                <span className="font-semibold text-gray-100">{step.phase}</span>
                <span className="text-xs bg-[#ef444422] text-[#EF4444] px-2 py-0.5 rounded">{step.severity.toUpperCase()}</span>
              </div>
              <span className="font-mono text-xs text-gray-400">{step.time}</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">{step.desc}</p>
            {step.status === 'active' && (
              <div className="flex gap-2 mt-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffffff0a] hover:bg-[#ffffff12] border border-[#ffffff1a] rounded text-xs transition-colors">
                  <Download size={14} /> Export PCAP
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded text-xs transition-colors">
                  <Zap size={14} /> Contain Threat
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttackChainTimeline;
