import { useEffect, useState } from 'react';
import { Search, Bell, ShieldAlert } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/': return 'Executive Dashboard';
    case '/timeline': return 'Threat Timeline';
    case '/investigation': return 'Threat Investigation';
    case '/graph': return 'Threat Graph';
    case '/replay': return 'Replay Mode';
    case '/dna': return 'Threat DNA Analysis';
    case '/alerts': return 'Alert Explorer';
    case '/analytics': return 'Detection Analytics';
    default: return 'ShadowPulse AI';
  }
};

const TopBar = () => {
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 glass border-b border-[#ffffff12] flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white tracking-wide">
          {getPageTitle(location.pathname)}
        </h1>
        <div className="h-4 w-[1px] bg-gray-600"></div>
        <div className="flex items-center gap-2 bg-[#ef444422] border border-[#ef444455] text-[#EF4444] px-2.5 py-1 rounded text-xs font-bold tracking-wider">
          <ShieldAlert size={14} />
          <span>ELEVATED THREAT</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search IPs, hashes, domains..." 
            className="bg-[#111827] border border-[#ffffff1a] text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:border-[#06B6D4] text-gray-200 w-64 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
          <div className="flex flex-col items-end">
            <span className="text-[#06B6D4]">INGESTION RATE</span>
            <span className="text-gray-200">3,492 EPS</span>
          </div>
          <div className="h-8 w-[1px] bg-[#ffffff1a]"></div>
          <div className="flex flex-col items-end">
            <span className="text-[#06B6D4]">UTC TIME</span>
            <span className="text-gray-200">{time.toISOString().split('T')[1].split('.')[0]} Z</span>
          </div>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
