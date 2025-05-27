// components/shared/index.tsx
import React, { useState, useEffect } from 'react';


// Animated Card Component
export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`
      transform transition-all duration-700 
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Glass Card Component
export const GlassCard: React.FC<GlassCardProps & { onClick?: () => void }> = ({ 
  children, 
  className = "", 
  hover = true,
  onClick
}) => {
  return (
    <div 
      className={`
        bg-white/10 backdrop-blur-md border border-white/20 rounded-xl
        ${hover ? 'hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};