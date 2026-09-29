import React from 'react';

interface GlassCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
  noPadding?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ title, children, className = '', headerRight, noPadding = false }) => {
  return (
    <div className={`glass-card rounded-xl overflow-hidden flex flex-col relative ${className}`}>
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent opacity-50"></div>
      
      {title && (
        <div className="px-5 py-3.5 border-b border-[#ffffff12] flex items-center justify-between bg-[#00000020]">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse-glow"></div>
            <h3 className="font-medium text-gray-200 text-sm tracking-wide uppercase">{title}</h3>
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      <div className={`flex-1 ${noPadding ? '' : 'p-5'}`}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
