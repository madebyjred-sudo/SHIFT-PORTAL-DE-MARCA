import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import ResonanceWaves from './ResonanceWaves';
import TopAppBar from './TopAppBar';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
        <TopAppBar />
      <div className="absolute inset-0 bg-gradient-to-br from-[#00235E] via-[#0047AB] to-[#FF00FF] opacity-95" />
      <ResonanceWaves />
      
      <div className="relative z-10 flex-grow flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center text-white max-w-4xl"
        >
          {/* Main Logo Text - Simulated with text for cleaner code, normally SVG */}
          <motion.h1 
            className="text-[120px] md:text-[180px] font-bold leading-none tracking-tighter opacity-20 select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            SHIFT
          </motion.h1>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 drop-shadow-lg relative z-10">
            Hacemos eco. <br/>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                Generamos resonancia.
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light">
            Amplificamos negocios a través de la comunicación estratégica. 
            Accede a todos los recursos visuales y guías de marca en un solo lugar.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="large" variant="filled" className="bg-secondary hover:bg-secondary/90 text-white border-none shadow-elevation-2" onClick={() => document.getElementById('brand-assets')?.scrollIntoView({ behavior: 'smooth'})}>
              Explorar Assets
            </Button>
            <Button size="large" variant="outlined" className="text-white border-white/40 hover:bg-white/10">
              Ver Guías
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="relative z-10 pb-8 flex justify-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <motion.div 
                className="w-1 h-2 bg-white rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;