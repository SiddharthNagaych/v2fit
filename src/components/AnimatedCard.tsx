import React, { useState, useEffect } from 'react';


export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);

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