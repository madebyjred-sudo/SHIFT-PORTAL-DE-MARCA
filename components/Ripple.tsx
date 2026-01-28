import React, { useState, useLayoutEffect } from 'react';

const useRipple = () => {
  const [ripples, setRipples] = useState<{ x: number; y: number; size: number; key: number }[]>([]);

  useLayoutEffect(() => {
    const timeouts = ripples.map((r) => setTimeout(() => {
        setRipples((prevState) => prevState.filter((prevRipple) => prevRipple.key !== r.key));
    }, 800)); // clear ripple after animation
    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [ripples]);

  const addRipple = (event: React.MouseEvent<HTMLElement>) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect();
    const size = rippleContainer.width > rippleContainer.height ? rippleContainer.width : rippleContainer.height;
    const x = event.clientX - rippleContainer.left - size / 2;
    const y = event.clientY - rippleContainer.top - size / 2;
    
    setRipples((prev) => [...prev, { x, y, size, key: Date.now() }]);
  };

  return { ripples, addRipple };
};

export const RippleContainer: React.FC = () => {
    // This is a helper if we wanted a standalone component, but usually we map inside the button
    return null; 
}

export default useRipple;