import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ViewType } from '../types';

interface ManifestoViewProps {
    onNavigate?: (view: ViewType) => void;
}

const ManifestoView: React.FC<ManifestoViewProps> = ({ onNavigate }) => {
    const [activeSlide, setActiveSlide] = useState(0);

    const nextSlide = () => {
        if (activeSlide === 2) {
            onNavigate?.('guidelines');
        } else {
            setActiveSlide((prev) => (prev + 1));
        }
    };

    const prevSlide = () => setActiveSlide((prev) => (prev - 1 + 3) % 3);

    return (
        <div className="h-[calc(100dvh-100px)] lg:h-[calc(100vh-100px)] w-full flex items-center justify-center p-4 md:p-6">
            <div className="relative w-full h-full max-w-[1600px] bg-[#0e1745] rounded-[20px] overflow-hidden border border-white/5 shadow-2xl flex flex-col">

                {/* Minimalist Grid Lines Background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)', backgroundSize: '100px 100px' }}>
                </div>

                {/* Content Area - Fixed with Scroll */}
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeSlide === 0 && <SlideOne key="slide1" />}
                        {activeSlide === 1 && <SlideTwo key="slide2" />}
                        {activeSlide === 2 && <SlideThree key="slide3" />}
                    </AnimatePresence>
                </div>

                {/* Footer Navigation - Swiss Style */}
                <div className="h-20 border-t border-white/10 flex items-center justify-between px-8 md:px-12 bg-[#0e1745] z-20">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                            {activeSlide + 1} / 3
                        </span>
                        <div className="h-[1px] w-12 bg-white/20"></div>
                        <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                            Manifesto
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevSlide}
                            disabled={activeSlide === 0}
                            className={`w-12 h-12 flex items-center justify-center rounded-full border border-white/10 transition-all duration-300 ${activeSlide === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:bg-white hover:text-black'}`}
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:bg-white hover:text-black transition-all duration-300 group"
                        >
                            {activeSlide === 2 ? <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> : <ArrowRight size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components for better organization ---

const SlideOne: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
            <div className="flex flex-col gap-2 md:gap-4 items-start justify-center max-w-5xl">
                <OverflowReveal delay={0.1}>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-[0.9]">
                        Hacemos <span className="font-light italic text-white/80">eco.</span>
                    </h1>
                </OverflowReveal>

                <OverflowReveal delay={0.4}>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-[0.9] ml-8 md:ml-32">
                        Generamos
                    </h1>
                </OverflowReveal>

                <OverflowReveal delay={0.5}>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-light text-white tracking-tighter leading-[0.9] ml-8 md:ml-32 italic">
                        resonancia.
                    </h1>
                </OverflowReveal>

                <div className="h-8 md:h-16"></div>

                <OverflowReveal delay={0.9}>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white tracking-tighter leading-[0.9]">
                        Amplificamos negocios.
                    </h1>
                </OverflowReveal>
            </div>

            {/* Subtle animated lines representing echo/resonance */}
            <div className="absolute inset-0 pointer-events-none">
                <EchoRipples />
            </div>
        </div>
    );
};

const SlideTwo: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col md:flex-row">
            {/* Left Col: Visual/Concept */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-full border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center relative bg-[#0F0F0F]">
                <div className="relative w-64 h-64 md:w-96 md:h-96">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 flex items-center justify-center text-center"
                    >
                        <h3 className="text-white/40 font-mono text-sm uppercase tracking-[0.2em] absolute top-[-40px]">The Signal</h3>
                    </motion.div>

                    {/* Clean 2D Animation: Concentric Circles expanding */}
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute inset-0 border border-white/20 rounded-full"
                            initial={{ scale: 0.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: [0, 1, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "circOut",
                                delay: i * 0.8
                            }}
                        />
                    ))}
                    <motion.div
                        className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </div>

            {/* Right Col: Scrollable Philosophy */}
            <div className="w-full md:w-1/2 h-[60vh] md:h-full overflow-y-auto custom-scrollbar p-8 md:p-16 flex flex-col justify-center">
                <div className="max-w-xl mx-auto space-y-12">
                    <div className="space-y-6">
                        <OverflowReveal delay={0.2}>
                            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                La comunicación no es amplificar mensajes. Es crear impacto que <span className="italic font-light">viaja</span>, <span className="italic font-light">permanece</span> y <span className="italic font-light">transforma.</span>
                            </h2>
                        </OverflowReveal>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "100px" }}
                            className="h-[1px] bg-white/30"
                        />
                    </div>

                    <div className="space-y-8 text-lg font-light text-white/70 leading-relaxed group">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="text-white font-medium">Un eco no es ruido:</span> es una señal que encuentra el espacio correcto para multiplicarse y llegar más lejos.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            Nuestra marca nace de esa idea: hacer eco en el mundo para generar resonancia en las personas, las marcas y los negocios.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="pl-4 border-l border-white/20"
                        >
                            No nos quedamos en el rol tradicional de PR. Trabajamos en el punto donde la comunicación activa cambio, impulsa decisiones y acompaña la evolución de las organizaciones.
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SlideThree: React.FC = () => {
    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#0A0A0A]">
            <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 space-y-24">

                {/* Section 1 */}
                <section className="space-y-8">
                    <OverflowReveal>
                        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Creemos que la comunicación no es ruido.</h2>
                    </OverflowReveal>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div></div>
                        <div className="space-y-4">
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-2xl md:text-3xl text-white font-light"
                            >
                                Es intención. Es dirección. <br /> <span className="italic font-bold">Es impacto que viaja.</span>
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/60 leading-relaxed"
                            >
                                No se trata de hablar más fuerte, sino de decir lo correcto en el momento preciso y en el lugar adecuado. Porque cuando un mensaje está bien pensado, no se pierde. Resuena.
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Section 2 - Full width statement */}
                <section className="border-t border-white/10 pt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center space-y-6"
                    >
                        <h3 className="text-3xl md:text-5xl italic font-light text-white/90">
                            "Hacemos eco en el mundo."
                        </h3>
                        <p className="max-w-2xl mx-auto text-lg text-white/60 leading-relaxed">
                            Un eco que cruza industrias, culturas y plataformas. Un eco que no se queda en la superficie, sino que conecta con personas, decisiones y negocios.
                        </p>
                    </motion.div>
                </section>

                {/* Section 3 - The Strategy */}
                <section className="grid md:grid-cols-2 gap-16 border-t border-white/10 pt-16">
                    <div className="space-y-8">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">Nuestra Estrategia</h4>
                        <p className="text-2xl md:text-3xl text-white font-light leading-snug">
                            Creemos en la comunicación como motor de cambio. Resonamos donde importa: en la reputación, en la confianza, en el crecimiento.
                        </p>
                    </div>
                    <div className="space-y-8 flex flex-col justify-end">
                        <p className="text-white/70 leading-relaxed">
                            Diseñamos mensajes que se expanden, ideas que encuentran su espacio y estrategias que generan movimiento.
                            <br /><br />
                            Nada es accidental. Cada palabra tiene intención. Cada forma, un propósito. Cada acción, una razón de ser.
                        </p>
                    </div>
                </section>

                {/* Final Closing */}
                <section className="py-24 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-xl text-white/50 mb-8">Porque cuando la comunicación es estratégica, se convierte en influencia.<br />Y cuando hay influencia, hay transformación.</p>

                        <div className="inline-flex flex-col items-center">
                            <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter">
                                Hacemos Eco.
                            </h2>
                            <h2 className="text-6xl md:text-8xl font-light italic text-white/80 tracking-tight -mt-4">
                                Generamos Resonancia.
                            </h2>
                            <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter -mt-4">
                                Movemos Negocios.
                            </h2>
                        </div>
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

// --- Helpers ---

const OverflowReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
    return (
        <div className="overflow-hidden">
            <motion.div
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
            >
                {children}
            </motion.div>
        </div>
    );
};

const EchoRipples = () => {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-hidden opacity-20 pointer-events-none mix-blend-screen">
            <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <motion.circle
                    cx="500" cy="500" r="100"
                    fill="none" stroke="white" strokeWidth="1"
                    initial={{ r: 100, opacity: 0 }}
                    animate={{ r: 800, opacity: [0, 0.3, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                    cx="500" cy="500" r="100"
                    fill="none" stroke="white" strokeWidth="1"
                    initial={{ r: 100, opacity: 0 }}
                    animate={{ r: 800, opacity: [0, 0.3, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
                />
                <motion.circle
                    cx="500" cy="500" r="100"
                    fill="none" stroke="white" strokeWidth="1"
                    initial={{ r: 100, opacity: 0 }}
                    animate={{ r: 800, opacity: [0, 0.3, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 4 }}
                />
            </svg>
        </div>
    )
}

export default ManifestoView;
