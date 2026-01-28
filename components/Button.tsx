import React from 'react';
import useRipple from './Ripple';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'filled', 
  size = 'medium', 
  className = '', 
  icon,
  onClick,
  ...props 
}) => {
  const { ripples, addRipple } = useRipple();

  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center font-medium transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-full active:scale-[0.98]";
  
  const variants = {
    filled: "bg-primary text-white hover:shadow-elevation-2 active:shadow-none hover:bg-primary/90",
    outlined: "border border-primary text-primary hover:bg-primary/5 active:bg-primary/10",
    text: "text-primary hover:bg-primary/5 active:bg-primary/10",
    elevated: "bg-surface text-primary shadow-elevation-1 hover:shadow-elevation-2 hover:bg-surface-dim",
  };

  const sizes = {
    small: "h-8 px-4 text-sm",
    medium: "h-10 px-6 text-base",
    large: "h-14 px-8 text-lg",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(e);
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="absolute rounded-full bg-current opacity-20 animate-ping"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            transform: 'scale(0)',
            animation: 'ripple 600ms linear',
            pointerEvents: 'none'
          }}
        />
      ))}
      {icon && <span className="mr-2">{icon}</span>}
      <span className="relative z-10">{children}</span>
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

export default Button;