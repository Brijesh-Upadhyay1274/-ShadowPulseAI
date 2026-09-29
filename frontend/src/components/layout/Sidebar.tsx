import { NavLink } from 'react-router-dom';
import { 
  Shield, Clock, Search, Share2, 
  PlayCircle, Dna, AlertTriangle, BarChart3, Radio
} from 'lucide-react';

const Sidebar = () => {
  const links = [
    { to: "/", icon: <Shield size={20} />, label: "Executive Dashboard" },
    { to: "/timeline", icon: <Clock size={20} />, label: "Threat Timeline" },
    { to: "/investigation", icon: <Search size={20} />, label: "Investigation" },
    { to: "/graph", icon: <Share2 size={20} />, label: "Threat Graph" },
    { to: "/replay", icon: <PlayCircle size={20} />, label: "Replay Mode" },
    { to: "/dna", icon: <Dna size={20} />, label: "Threat DNA" },
    { to: "/alerts", icon: <AlertTriangle size={20} />, label: "Alert Explorer" },
    { to: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" }
  ];

  return (
    <aside className="w-64 bg-[#0B1120] border-r border-[#ffffff12] flex flex-col shadow-2xl z-20 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-[#ffffff12] gap-3">
        <div className="w-3 h-3 rounded-full bg-[#06B6D4] animate-pulse-glow shadow-[0_0_8px_#06B6D4]"></div>
        <span className="font-mono font-bold text-lg tracking-wider text-white">ShadowPulse<span className="text-[#06B6D4]">AI</span></span>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-[#06B6D4] text-[#050811] font-medium shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
                  : 'text-gray-400 hover:text-gray-100 hover:bg-[#ffffff0a]'
              }`
            }
          >
            {link.icon}
            <span className="text-sm">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#ffffff12]">
        <div className="glass-card rounded-lg p-3 flex items-center gap-3">
          <Radio size={18} className="text-[#10B981] animate-pulse" />
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">System Status</div>
            <div className="text-sm text-[#10B981] font-mono mt-0.5">NTRO LINK ONLINE</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
