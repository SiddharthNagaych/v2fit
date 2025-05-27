import React from 'react';


export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  hover = true 
}) => {
  return (
    <div className={`
      bg-white/10 backdrop-blur-md border border-white/20 rounded-xl
      ${hover ? 'hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};