import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Layers, FileText, Layout, Zap, AudioWaveform } from 'lucide-react';
import { ViewType } from '../types';
import ResonanceWaves from './ResonanceWaves';
import BrandLogo from './BrandLogo';
import useRipple from './Ripple';
import { useSearch } from '../context/SearchContext';
import SearchResults from './SearchResults';



interface HomeHubProps {
    onNavigate: (view: ViewType, params?: any) => void;
    onOpenChat?: () => void;
}

const HomeHub: React.FC<HomeHubProps> = ({ onNavigate, onOpenChat }) => {
    const [isLogoHovered, setIsLogoHovered] = useState(false);
    const [isChatHovered, setIsChatHovered] = useState(false);
    const { query, setQuery } = useSearch();

    const springTransition = {
        type: "spring" as const,
        stiffness: 400,
        damping: 30
    };

    return (
        <div className="w-full overflow-x-hidden">
            {/* HERO SECTION - 100vh */}
            <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-mesh">
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none mix-blend-overlay z-0"
                >
                    <source src="/hero_bg.mp4" type="video/mp4" />
                </video>

                {/* Background Layers */}
                <ResonanceWaves />

                {/* Empty Header for spacing */}
                <header className="relative z-10 h-20 w-full" />

                {/* Main Content */}
                <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 -mt-20">


                    {/* Logo & Search Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-5xl w-full mb-8 md:mb-16 flex flex-col items-center"
                    >
                        {/* LOGO INTERACTION: Perfectly centered, Logo shifts left, Badge shifts right on hover */}
                        <motion.div
                            className="relative flex items-center justify-center h-16 mb-8 cursor-pointer"
                            onHoverStart={() => setIsLogoHovered(true)}
                            onHoverEnd={() => setIsLogoHovered(false)}
                            onClick={() => onNavigate('home')}
                            layout
                        >
                            <motion.div
                                layout
                                transition={springTransition}
                                className="z-20"
                                animate={{ scale: isLogoHovered ? 1.4 : 1.25 }}
                            >
                                <BrandLogo variant="white" className="h-12 w-auto" />
                            </motion.div>

                            <AnimatePresence>
                                {isLogoHovered && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0, x: -10 }}
                                        animate={{ width: "auto", opacity: 1, x: 0 }}
                                        exit={{ width: 0, opacity: 0, x: -10 }}
                                        transition={springTransition}
                                        className="overflow-hidden flex items-center pl-4"
                                    >
                                        <div className="whitespace-nowrap inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                                            <Zap size={12} className="fill-current text-secondary" />
                                            Hub de Marca v2.0
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 md:mb-10 tracking-tight drop-shadow-lg leading-tight px-2">
                            ¿Qué querés crear hoy?
                        </h1>

                        {/* SEARCH + SHIFTY BUTTON CONTAINER */}
                        {/* Using Layout prop to handle the centering shift automatically */}
                        <motion.div
                            layout
                            transition={springTransition}
                            className="w-full max-w-3xl mx-auto flex items-center justify-center gap-4"
                        >
                            {/* Search Input */}
                            <motion.div
                                layout
                                transition={springTransition}
                                className="group relative h-16 w-full max-w-lg"
                            >
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-colors opacity-50" />
                                <div className="relative z-50 flex items-center bg-white/10 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 p-2 pr-4 transition-all focus-within:bg-white/20 focus-within:border-white/40 h-full w-full">
                                    <div className="p-3 text-secondary ml-2">
                                        <Search size={24} />
                                    </div>
                                    <input
                                        type="text"
                                        value={query || ''}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Buscá logos, colores o plantillas..."
                                        className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-white/50 min-w-0"
                                    />
                                    <div className="hidden md:flex items-center gap-2 text-xs text-white/60 font-medium px-2 bg-white/10 rounded-md border border-white/10 py-1">
                                        ⌘ K
                                    </div>
                                    <SearchResults onNavigate={onNavigate} />
                                </div>
                            </motion.div>

                            {/* Liquid Shifty Button - Expands text to right, pushing search to left */}
                            <motion.button
                                layout
                                transition={springTransition}
                                onClick={onOpenChat}
                                onHoverStart={() => setIsChatHovered(true)}
                                onHoverEnd={() => setIsChatHovered(false)}
                                className="relative group flex items-center justify-center h-16 rounded-[32px] backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(255,0,255,0.2)] bg-gradient-to-br from-[#FF00FF]/30 to-[#FF00FF]/10 hover:bg-[#FF00FF]/30 hover:border-[#FF00FF]/60 hover:shadow-[0_12px_40px_rgba(255,0,255,0.5)] overflow-hidden shrink-0"
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    layout
                                    transition={springTransition}
                                    className="text-white relative z-10 flex items-center justify-center w-16 h-16"
                                >
                                    <BrandLogo variant="white" showText={false} className="scale-110" scale={1} />
                                </motion.div>

                                <AnimatePresence>
                                    {isChatHovered && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: "auto", opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={springTransition}
                                            className="font-bold text-white whitespace-nowrap overflow-hidden pr-6 relative z-10"
                                        >
                                            Asistente Shifty
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Glossy sheen overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity" />
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* Cards Grid - Horizontal scroll on mobile, grid on desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="w-full max-w-7xl px-4"
                    >
                        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide scroll-touch -mx-4 px-4 md:mx-0 md:px-0">
                            {/* Card 0: Manifiesto (NEW) */}
                            <motion.div
                                onClick={() => onNavigate('manifesto')}
                                whileTap={{ scale: 0.98 }}
                                className="group relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:shadow-2xl hover:border-white/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 md:mb-6 group-hover:scale-110 group-active:scale-95 transition-transform relative z-10">
                                    <Zap size={22} className="text-purple-300" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2 relative z-10">Manifiesto</h3>
                                <p className="text-white/60 mb-4 md:mb-8 leading-relaxed text-sm md:text-base relative z-10">
                                    Hacemos eco. Generamos resonancia. Descubrí nuestra filosofía.
                                </p>
                                <div className="flex items-center text-white font-semibold text-sm md:text-base group-hover:gap-2 transition-all relative z-10">
                                    Ver Manifiesto <ArrowRight size={16} className="ml-2" />
                                </div>
                            </motion.div>

                            {/* Card 1: Guidelines */}
                            <motion.div
                                onClick={() => onNavigate('guidelines')}
                                whileTap={{ scale: 0.98 }}
                                className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:bg-white/10 hover:shadow-2xl hover:border-white/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 md:mb-6 group-hover:scale-110 group-active:scale-95 transition-transform">
                                    <FileText size={22} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Guías de Marca</h3>
                                <p className="text-white/60 mb-4 md:mb-8 leading-relaxed text-sm md:text-base">
                                    Aprendé a usar el sistema "Echo & Resonance" correctamente.
                                </p>
                                <div className="flex items-center text-white font-semibold text-sm md:text-base group-hover:gap-2 transition-all">
                                    Documentación <ArrowRight size={16} className="ml-2" />
                                </div>
                            </motion.div>

                            {/* Card 2: Assets */}
                            <motion.div
                                onClick={() => onNavigate('assets')}
                                whileTap={{ scale: 0.98 }}
                                className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:bg-white/10 hover:shadow-2xl hover:border-white/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 md:mb-6 group-hover:scale-110 group-active:scale-95 transition-transform">
                                    <Layers size={22} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Tienda de Assets</h3>
                                <p className="text-white/60 mb-4 md:mb-8 leading-relaxed text-sm md:text-base">
                                    Accedé a la biblioteca completa de logos, íconos, motion y fotografía.
                                </p>
                                <div className="flex items-center text-white font-semibold text-sm md:text-base group-hover:gap-2 transition-all">
                                    Explorar <ArrowRight size={16} className="ml-2" />
                                </div>
                            </motion.div>

                            {/* Card 3: Templates */}
                            <motion.div
                                onClick={() => onNavigate('templates')}
                                whileTap={{ scale: 0.98 }}
                                className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:bg-white/10 hover:shadow-2xl hover:border-white/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 md:mb-6 group-hover:scale-110 group-active:scale-95 transition-transform">
                                    <Layout size={22} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Plantillas</h3>
                                <p className="text-white/60 mb-4 md:mb-8 leading-relaxed text-sm md:text-base">
                                    Descargá decks de PPT, marcos para redes y diseños listos para usar.
                                </p>
                                <div className="flex items-center text-white font-semibold text-sm md:text-base group-hover:gap-2 transition-all">
                                    Comenzar <ArrowRight size={16} className="ml-2" />
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>

                    {/* Footer Context - Hidden on mobile for cleaner look */}
                    <div className="mt-12 md:mt-20 text-center hidden md:block">
                        <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">Últimas Actualizaciones</p>
                        <div className="inline-flex items-center gap-6 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm text-white/80">
                            <span>🚀 Nuevo Sistema de Motion v2.1 lanzado</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span>🎨 Paleta de colores secundarios actualizada</span>
                        </div>
                    </div>

                    {/* Mobile scroll indicator */}
                    <div className="mt-6 md:hidden flex items-center justify-center gap-2">
                        <div className="w-8 h-1 rounded-full bg-white/30" />
                        <div className="w-2 h-1 rounded-full bg-white/20" />
                        <div className="w-2 h-1 rounded-full bg-white/20" />
                    </div>
                </main>
            </div>

            {/* Brand Rationale Section - Removed */}

        </div>
    );
};

export default HomeHub;