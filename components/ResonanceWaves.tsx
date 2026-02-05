import React from 'react';
import { motion } from 'framer-motion';

const ResonanceWaves: React.FC = () => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1440 900" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d="M0,450 C360,350 1080,550 1440,450"
          stroke="url(#waveGradient)"
          strokeWidth={2 + i}
          fill="none"
          initial={{ pathLength: 0, opacity: 0, pathOffset: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            pathOffset: [0, 0, 1],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
      {[0, 1].map((i) => (
        <motion.path
          key={`curve-${i}`}
          d="M0,500 C400,600 1000,300 1440,500"
          stroke="url(#waveGradient)"
          strokeWidth={1}
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </svg>
  );
};

export default ResonanceWaves;