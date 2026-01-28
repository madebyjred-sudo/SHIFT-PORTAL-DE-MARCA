import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Type, Droplet, Layout, Palette, Scaling, Ratio, BoxSelect, FileText, Monitor, Calculator, ArrowDown, Download, ExternalLink, PieChart, Sparkles } from 'lucide-react';
import { BRAND_COLORS } from '../constants';

// --- Utility Component for Copy Animation ---
const CopyTrigger: React.FC<{ value: string; children: React.ReactNode; className?: string }> = ({ value, children, className = "" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div
            onClick={handleCopy}
            className={`relative cursor-pointer select-none group/copy ${className}`}
            title={`Copiar: ${value}`}
        >
            {children}
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: -30, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-0 bg-gray-900 text-white text-[10px] font-bold py-1 px-3 rounded-full whitespace-nowrap z-50 pointer-events-none shadow-lg flex items-center gap-1.5"
                    >
                        <Check size={10} className="text-green-400" />
                        Valor copiado
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ColorSwatch: React.FC<{ color: string; name: string; hex: string; label?: string }> = ({ color, name, hex, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group cursor-pointer"
            onClick={handleCopy}
        >
            <div
                className="h-24 rounded-2xl shadow-sm border border-black/5 relative overflow-hidden mb-3 transition-shadow group-hover:shadow-xl"
                style={{ backgroundColor: hex }}
            >
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 text-sm leading-tight">{name}</h4>
                    {copied && <span className="text-[10px] text-green-600 font-bold">✓</span>}
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-gray-400 font-mono uppercase">{hex}</p>
                    {label && <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">{label}</span>}
                </div>
            </div>
        </motion.div>
    );
};

const ColorDistribution: React.FC = () => {
    // Data definition with explicit percentages
    const leftCol = [
        { pct: 5, label: 'Negro Profundo', hex: '#0f0f0f', textColor: 'text-white' },
        { pct: 30, label: 'Azul Marino', hex: '#0e1745', textColor: 'text-white' },
        { pct: 20, label: 'Azul Profundo', hex: '#002e6d', textColor: 'text-white' },
        { pct: 20, label: 'Azul Real', hex: '#1534dc', textColor: 'text-white' },
        { pct: 5, label: 'Magenta', hex: '#f540ff', textColor: 'text-white' },
    ];

    const rightCol = [
        { pct: 5, label: 'Blanco Superficie', hex: '#edf0fe', textColor: 'text-[#0e1745]' },
        { pct: 5, label: 'Amatista', hex: '#9244d8', textColor: 'text-white' },
        { pct: 10, label: 'Azul Brillante', hex: '#3c55d8', textColor: 'text-white' },
    ];

    // Calculate totals to derive relative heights dynamically
    const leftTotal = leftCol.reduce((acc, item) => acc + item.pct, 0); // Expecting 80
    const rightTotal = rightCol.reduce((acc, item) => acc + item.pct, 0); // Expecting 20

    return (
        <div className="w-full">
            <h4 className="font-bold text-tertiary mb-6 flex items-center gap-2">
                <PieChart size={18} className="text-secondary" />
                Proporción de Uso (Sistema 80/20)
            </h4>

            {/* Main Container */}
            <div className="w-full h-[500px] flex rounded-[1.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 font-figtree relative bg-white">

                {/* Left Column */}
                <div className="w-[80%] flex flex-col h-full border-r border-white/10">
                    {leftCol.map((item, i) => {
                        const heightPercentage = (item.pct / leftTotal) * 100;
                        return (
                            <div
                                key={`left-${i}`}
                                className={`group relative w-full flex items-center justify-center transition-all duration-500 hover:brightness-110 z-0 hover:z-10 ${item.textColor}`}
                                style={{ backgroundColor: item.hex, height: `${heightPercentage}%` }}
                            >
                                <div className="flex items-center gap-3 px-4 py-1 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300 backdrop-blur-sm">
                                    <span className="text-sm font-bold opacity-70 group-hover:opacity-100">{item.pct}%</span>
                                    <div className="w-0 overflow-hidden opacity-0 group-hover:w-auto group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] whitespace-nowrap">
                                        <span className="text-sm font-medium border-l border-white/30 pl-3">
                                            {item.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Column */}
                <div className="w-[20%] flex flex-col h-full">
                    {rightCol.map((item, i) => {
                        const heightPercentage = (item.pct / rightTotal) * 100;
                        return (
                            <div
                                key={`right-${i}`}
                                className={`group relative w-full flex items-center justify-center transition-all duration-500 hover:brightness-105 z-0 hover:z-10 ${item.textColor}`}
                                style={{ backgroundColor: item.hex, height: `${heightPercentage}%` }}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">{item.pct}%</span>
                                    <div className="h-0 overflow-hidden opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-xs font-medium text-center">
                                        {item.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between mt-3 text-xs text-gray-400 px-2 font-mono">
                <span>Base Corporativa (80%)</span>
                <span>Acentos & Superficies (20%)</span>
            </div>
        </div>
    );
};

interface TypographyCardProps {
    name: string;
    role: string;
    description: string;
    usage: string[];
    weights: string[];
    fontClass: string;
    previewText: string;
    defaultText: string;
    isDark?: boolean;
    isInputHovered: boolean;
    downloadUrl: string;
    isExternalDownload?: boolean;
    onHoverStart: () => void;
    onHoverEnd: () => void;
}

const TypographyCard: React.FC<TypographyCardProps> = ({
    name, role, description, usage, weights, fontClass, previewText, defaultText, isDark = false, isInputHovered, downloadUrl, isExternalDownload = false, onHoverStart, onHoverEnd
}) => {
    return (
        <motion.div
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            whileHover={{ y: -5 }}
            className={`relative rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden min-h-[400px] border transition-all duration-300 group ${isDark
                ? 'bg-[#0e1745] text-white border-transparent'
                : 'bg-white text-gray-900 border-gray-100'
                } ${isInputHovered ? 'shadow-[0_0_25px_rgba(255,0,255,0.25)] ring-1 ring-secondary/30' : 'shadow-xl'}`}
        >
            <div className={`absolute inset-0 bg-secondary/5 blur-3xl rounded-full pointer-events-none transition-opacity duration-500 ${isInputHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
            {isDark && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-20 blur-[80px] rounded-full pointer-events-none" />
            )}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {role}
                    </span>

                    {/* Download Button */}
                    <a
                        href={downloadUrl}
                        download={!isExternalDownload}
                        target={isExternalDownload ? "_blank" : undefined}
                        rel={isExternalDownload ? "noopener noreferrer" : undefined}
                        className={`p-2 rounded-full transition-colors flex items-center gap-2 text-xs font-bold ${isDark
                            ? 'bg-white/10 text-white hover:bg-white hover:text-primary'
                            : 'bg-gray-100 text-gray-600 hover:bg-primary hover:text-white'
                            }`}
                        title="Descargar Fuente"
                    >
                        <Download size={14} />
                        {isExternalDownload ? <ExternalLink size={10} className="opacity-70" /> : null}
                    </a>
                </div>

                <h3 className={`text-5xl mb-2 ${fontClass}`}>{name}</h3>
                <p className={`text-sm mb-8 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                    {description}
                </p>

                <div className={`p-6 rounded-2xl mb-8 transition-colors duration-300 ${isDark
                    ? 'bg-white/5 border border-white/10 group-hover:bg-white/10'
                    : 'bg-gray-50 border border-gray-100 group-hover:bg-gray-100'
                    }`}>
                    <p className={`text-3xl leading-tight break-words ${fontClass} ${previewText ? 'opacity-100' : 'opacity-40'}`}>
                        {previewText || defaultText}
                    </p>
                </div>
            </div>

            <div className={`pt-6 border-t relative z-10 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                            Uso Correcto
                        </span>
                        <ul className="space-y-1">
                            {usage.map(u => (
                                <li key={u} className={`text-xs font-medium flex items-center gap-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                                    <span className="w-1 h-1 rounded-full bg-secondary" />
                                    {u}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <span className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                            Pesos Disponibles
                        </span>
                        <div className={`text-xs font-medium ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                            {weights.join(', ')}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

const HierarchyShowcase: React.FC = () => {
    const themes = [
        { bg: 'bg-white', text: 'text-tertiary', accent: 'text-primary', border: 'border-gray-200', name: 'Clean Light' },
        { bg: 'bg-primary', text: 'text-white', accent: 'text-secondary', border: 'border-white/20', name: 'Brand Primary' },
        { bg: 'bg-[#0e1745]', text: 'text-white', accent: 'text-secondary', border: 'border-white/10', name: 'Deep Navy' },
        { bg: 'bg-secondary', text: 'text-white', accent: 'text-tertiary', border: 'border-white/20', name: 'Vibrant Magenta' },
        { bg: 'bg-gradient-to-br from-[#0e1745] to-black', text: 'text-white', accent: 'text-primary', border: 'border-white/10', name: 'Dark Mode' }
    ];

    const [currentTheme, setCurrentTheme] = useState(0);

    const toggleTheme = () => {
        setCurrentTheme((prev) => (prev + 1) % themes.length);
    };

    const theme = themes[currentTheme];

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-tertiary flex items-center gap-2">
                    <Layout size={20} className="text-secondary" />
                    Jerarquía en Acción
                </h3>

                <div className="relative group">
                    <div className="absolute inset-0 bg-secondary blur-xl rounded-full opacity-30 group-hover:opacity-70 transition-opacity duration-300" />
                    <button
                        onClick={toggleTheme}
                        className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-secondary/20 shadow-md group-hover:border-secondary transition-all text-sm font-bold text-gray-700 group-hover:text-secondary"
                    >
                        <Palette size={16} />
                        Cambiar Fondo ({theme.name})
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentTheme}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full rounded-[2rem] p-8 md:p-12 shadow-2xl border ${theme.border} ${theme.bg} transition-colors duration-500 relative overflow-hidden`}
                >
                    <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-8">
                        <div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block opacity-60 ${theme.text}`}>H1 • Glitz Regular</span>
                            <h1 className={`font-glitz text-5xl md:text-7xl leading-[0.9] ${theme.text}`}>
                                Amplificamos el futuro.
                            </h1>
                        </div>
                        <div className={`flex flex-col md:flex-row gap-8 border-l-2 pl-6 opacity-90 transition-colors duration-300`} style={{ borderColor: 'currentColor', color: 'inherit' }}>
                            <div className="flex-1">
                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block opacity-60 ${theme.text}`}>H2 • Figtree Bold</span>
                                <h2 className={`font-figtree font-bold text-2xl md:text-3xl mb-3 ${theme.text}`}>
                                    Estrategia que resuena en toda la región.
                                </h2>
                                <p className={`font-figtree font-medium text-lg ${theme.accent} transition-colors duration-300`}>
                                    Conectamos marcas con personas a través de historias auténticas.
                                </p>
                            </div>
                        </div>
                        <div className="max-w-2xl">
                            <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block opacity-60 ${theme.text}`}>Body • Mozilla Text (Fira Sans)</span>
                            <p className={`font-mozilla text-base md:text-lg leading-relaxed ${theme.text} opacity-80`}>
                                En Shift Porter Novelli, entendemos que la comunicación no es unidireccional.
                                Es un ciclo constante de emisión y recepción. Nuestro enfoque basado en datos
                                nos permite ajustar la frecuencia para maximizar el impacto en cada mercado.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Golden Ratio / Fibonacci Component - Reconstructed from Official SVG Geometry
const GoldenSpiral: React.FC = () => {
    return (
        <div className="relative w-full aspect-[1.58/1] bg-tertiary rounded-xl overflow-hidden flex items-center justify-center border border-white/10 shadow-inner">
            {/* Architectural Grid */}
            <div className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            <svg viewBox="0 0 915 580" className="w-[95%] h-auto opacity-100 drop-shadow-lg">
                <defs>
                    <linearGradient id="blueprintGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#f540ff" stopOpacity="0.8" />
                    </linearGradient>
                </defs>

                <motion.g
                    stroke="url(#blueprintGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                >
                    {/* Rectangles / Construction Lines from SVG */}
                    <motion.path d="M 653.49848,415.88344 V 404.55528" />
                    <motion.path d="M 661.05275,415.88294 H 642.16583" />
                    <motion.path d="m 653.49798,412.10688 h 7.55477" />
                    <motion.path d="m 657.27586,412.10738 v 3.77606" />
                    <motion.path d="m 661.05325,404.55428 v 30.20844" />
                    <motion.path d="m 642.16586,404.55478 h 49.10598" />
                    <motion.path d="M 642.16636,434.76372 V 355.46656" />
                    <motion.path d="M 691.27181,434.76322 H 562.84079" />
                    <motion.path d="M 691.27234,355.46658 V 563.14961" />
                    <motion.path d="M 562.8408,355.27506 H 899.21875" />
                    <motion.path d="M 562.84129,563.14958 V 19.397678" />
                    <motion.path d="M 18.89815,563.1496 V 18.89761" />
                    <motion.path d="M 899.02836,562.64954 V 18.897641" />
                    <motion.path d="M 18.89765,18.897107 H 899.5276" />
                    <motion.path d="M 18.89765,563.14909 H 899.52759" />

                    {/* Spiral Arcs - Staggered Animation */}
                    <motion.path d="M 18.898132,563.14957 A 543.94263,543.75146 0 0 1 562.84077,19.398132" transition={{ duration: 1, ease: "linear", delay: 0 }} />
                    <motion.path d="M -899.02731,355.46605 A 336.18655,336.06839 0 0 1 -562.84075,19.397675" transform="scale(-1,1)" transition={{ duration: 1, ease: "linear", delay: 1 }} />
                    <motion.path d="m -563.14906,-691.27235 a 207.68251,207.75557 0 0 1 207.68251,-207.75556" transform="matrix(0,-1,-1,0,0,0)" transition={{ duration: 1, ease: "linear", delay: 2 }} />
                    <motion.path d="M 562.84128,-434.76319 A 128.43051,128.38536 0 0 1 691.27179,-563.14854" transform="scale(1,-1)" transition={{ duration: 0.8, ease: "linear", delay: 3 }} />
                    <motion.path d="m 562.84184,434.7637 a 79.324539,79.296654 0 0 1 79.32454,-79.29665" transition={{ duration: 0.8, ease: "linear", delay: 3.8 }} />
                    <motion.path d="m -691.27137,404.55478 a 49.105476,49.088211 0 0 1 49.10548,-49.08821" transform="scale(-1,1)" transition={{ duration: 0.6, ease: "linear", delay: 4.6 }} />
                    <motion.path d="m -691.27178,-404.55426 a 30.218561,30.207939 0 0 1 30.21856,-30.20794" transform="scale(-1)" transition={{ duration: 0.6, ease: "linear", delay: 5.2 }} />
                    <motion.path d="m 642.16632,-415.8829 a 18.886414,18.879776 0 0 1 18.88641,-18.87978" transform="scale(1,-1)" transition={{ duration: 0.5, ease: "linear", delay: 5.8 }} />
                    <motion.path d="m 642.16683,415.88342 a 11.331649,11.327665 0 0 1 11.33164,-11.32766" transition={{ duration: 0.5, ease: "linear", delay: 6.3 }} />
                    <motion.path d="m -661.05231,412.10681 a 7.5542655,7.5516105 0 0 1 7.55426,-7.55161" transform="scale(-1,1)" transition={{ duration: 0.4, ease: "linear", delay: 6.8 }} />
                    <motion.path d="m -661.05276,-412.10736 a 3.7768829,3.7755551 0 0 1 3.77688,-3.77556" transform="scale(-1)" transition={{ duration: 0.4, ease: "linear", delay: 7.2 }} />
                    <motion.path d="m 653.50534,-412.10101 a 3.7768831,3.7755556 0 0 1 3.77689,-3.77556" transform="scale(1,-1)" transition={{ duration: 0.4, ease: "linear", delay: 7.6 }} />
                </motion.g>

                <circle cx="562" cy="355" r="3" fill="#f540ff" className="animate-pulse" />
            </svg>

            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/40 bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                φ ≈ 1.618
            </div>
        </div>
    );
};

// New Component: Powers of Phi
const PhiPowers: React.FC = () => {
    const powers = [
        { exp: 1, val: '1.618', label: 'Golden Ratio', usage: 'Base Multiplier' },
        { exp: 2, val: '2.618', label: 'Column Width', usage: 'Grid Layouts' },
        { exp: 3, val: '4.236', label: 'Header Height', usage: 'Major Structural Blocks' },
        { exp: 4, val: '6.854', label: 'Margin Large', usage: 'Page Margins' },
        { exp: 5, val: '11.09', label: 'Margin Small', usage: 'Gutters / Padding' },
    ];

    return (
        <div className="bg-white rounded-[2rem] border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <Scaling size={20} className="text-secondary" />
                <h4 className="font-bold text-tertiary text-lg">Potencias de Phi (φⁿ)</h4>
            </div>
            <p className="text-sm text-gray-500 mb-6 max-w-2xl">
                Para acelerar el proceso de diseño, utilizá potencias de Phi como divisores del ancho total (W) o multiplicadores de la fuente base.
                Cuanto mayor es el exponente, menor es el bloque resultante.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {powers.map((p) => (
                    <CopyTrigger key={p.exp} value={p.val} className="h-full">
                        <div className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-secondary/30 hover:bg-white hover:shadow-md transition-all group h-full">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-serif italic text-lg text-tertiary group-hover:text-secondary transition-colors">φ<sup className="text-xs">{p.exp}</sup></span>
                                <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500 font-mono group-hover:text-secondary group-hover:border-secondary/30 transition-colors">{p.val}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-700 mb-1">{p.label}</span>
                            <span className="text-[10px] text-gray-500">{p.usage}</span>
                        </div>
                    </CopyTrigger>
                ))}
            </div>
        </div>
    );
};

interface LayoutMockProps {
    type: 'slide-columns' | 'slide-grid' | 'doc-letter';
    title: string;
}

const LayoutMock: React.FC<LayoutMockProps> = ({ type, title }) => {
    const renderContent = () => {
        switch (type) {
            case 'slide-columns':
                return (
                    <div className="w-full h-full p-4 flex gap-4 bg-gray-50">
                        {/* Golden Ratio Columns: 1 : 1.618 */}
                        <div className="w-[38%] h-full bg-white rounded-lg border border-gray-200 shadow-sm p-3 flex flex-col gap-2">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full mb-auto" />
                            <div className="w-full h-2 bg-gray-100 rounded" />
                            <div className="w-2/3 h-2 bg-gray-100 rounded" />
                        </div>
                        <div className="flex-1 h-full bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
                            <div className="w-1/2 h-4 bg-tertiary/10 rounded" />
                            <div className="w-full h-2 bg-gray-100 rounded" />
                            <div className="w-full h-2 bg-gray-100 rounded" />
                            <div className="w-full h-2 bg-gray-100 rounded" />
                            <div className="w-3/4 h-2 bg-gray-100 rounded" />
                            <div className="mt-auto w-full h-20 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-center">
                                <span className="text-[10px] text-primary/40 font-mono">Image Area</span>
                            </div>
                        </div>
                    </div>
                );
            case 'slide-grid':
                return (
                    <div className="w-full h-full bg-gray-50 relative overflow-hidden">
                        {/* Fibonacci Grid Overlay */}
                        <div className="absolute inset-0 grid grid-cols-12 gap-2 p-4 opacity-10">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="bg-red-500 h-full w-full" />
                            ))}
                        </div>

                        <div className="absolute inset-4 border border-dashed border-secondary/30 rounded-lg flex flex-col">
                            <div className="h-16 border-b border-dashed border-secondary/30 w-full flex items-center px-4">
                                <div className="w-32 h-3 bg-secondary/20 rounded" />
                            </div>
                            <div className="flex-1 flex">
                                <div className="w-1/3 border-r border-dashed border-secondary/30 h-full p-4">
                                    <div className="w-full h-2 bg-gray-200 rounded mb-2" />
                                    <div className="w-full h-2 bg-gray-200 rounded mb-2" />
                                    <div className="w-2/3 h-2 bg-gray-200 rounded" />
                                </div>
                                <div className="flex-1 p-4">
                                    <div className="w-full h-full bg-white border border-gray-200 rounded shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'doc-letter':
                return (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4">
                        <div className="w-[60%] aspect-[1/1.414] bg-white shadow-md rounded-sm p-3 flex flex-col gap-2 relative">
                            {/* Letterhead */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="w-4 h-4 bg-tertiary rounded-sm" />
                                <div className="flex flex-col gap-0.5 items-end">
                                    <div className="w-8 h-1 bg-gray-200 rounded-full" />
                                    <div className="w-6 h-1 bg-gray-200 rounded-full" />
                                </div>
                            </div>

                            <div className="w-full h-px bg-primary mb-2" />

                            <div className="space-y-1">
                                <div className="w-full h-1 bg-gray-100 rounded-full" />
                                <div className="w-full h-1 bg-gray-100 rounded-full" />
                                <div className="w-full h-1 bg-gray-100 rounded-full" />
                                <div className="w-3/4 h-1 bg-gray-100 rounded-full" />
                            </div>

                            <div className="space-y-1 mt-2">
                                <div className="w-full h-1 bg-gray-100 rounded-full" />
                                <div className="w-full h-1 bg-gray-100 rounded-full" />
                                <div className="w-1/2 h-1 bg-gray-100 rounded-full" />
                            </div>

                            <div className="mt-auto flex justify-between items-end">
                                <div className="w-8 h-8 bg-gray-50 rounded-sm border border-dashed border-gray-300" />
                                <div className="w-10 h-0.5 bg-black" />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-3 group">
            <div className="aspect-[1.618/1] w-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm group-hover:shadow-md transition-all group-hover:border-primary/20">
                {renderContent()}
            </div>
            <div className="flex items-center gap-2 pl-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-colors" />
                <span className="text-sm font-bold text-gray-500 group-hover:text-primary transition-colors">{title}</span>
            </div>
        </div>
    );
};

const LogoSystem: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [downloadModalOpen, setDownloadModalOpen] = useState(false);
    const [downloadVariant, setDownloadVariant] = useState<typeof allVariants[0] | null>(null);
    const [selectedColor, setSelectedColor] = useState('#ffffff');

    // All logo variants with detailed descriptions
    const allVariants = [
        {
            file: '/logov3x.svg',
            label: 'Full',
            tag: 'LOGOTIPO COMPLETO',
            minWidth: '180px',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            usage: 'Papelería corporativa, sitios web, presentaciones ejecutivas',
            ratio: '2/5'
        },
        {
            file: '/logov2x.svg',
            label: 'Compact',
            tag: 'LOGOTIPO COMPACTO',
            minWidth: '120px',
            description: 'Versión reducida que mantiene la tipografía pero con menor espaciado. Ideal cuando el reconocimiento de marca ya está establecido y se necesita optimizar el espacio horizontal disponible.',
            usage: 'Navegación desktop, tarjetas de visita, redes sociales',
            ratio: '3/5'
        },
        {
            file: '/logov1x.svg',
            label: 'Reduced',
            tag: 'LOGOTIPO REDUCIDO',
            minWidth: '80px',
            description: 'La versión más compacta del logotipo con tipografía. Optimizada para espacios muy limitados donde aún se requiere presencia textual de la marca.',
            usage: 'Navegación móvil, footers, watermarks',
            ratio: '4/5'
        },
        {
            file: '/isov2x.svg',
            label: 'Mark',
            tag: 'ISOTIPO PRINCIPAL',
            minWidth: '48px',
            description: 'El símbolo aislado representa la esencia de Shift. Utilizado cuando el contexto ya establece el reconocimiento de marca o cuando el espacio no permite tipografía legible.',
            usage: 'Avatares, íconos de app, favicons grandes',
            ratio: '5/5'
        },
        {
            file: '/isov1x.svg',
            label: 'Micro',
            tag: 'ISOTIPO MÍNIMO',
            minWidth: '24px',
            description: 'Representación mínima del símbolo. Optimizado para tamaños extremadamente pequeños manteniendo reconocibilidad instantánea.',
            usage: 'Favicons, system tray, notificaciones push',
            ratio: '5/5'
        },
    ];

    // Brand colors for download
    const brandColors = [
        { name: 'Blanco', hex: '#ffffff', bgClass: 'bg-white border-2 border-gray-200' },
        { name: 'Royal Blue', hex: '#1534dc', bgClass: 'bg-[#1534dc]' },
        { name: 'Magenta', hex: '#f540ff', bgClass: 'bg-[#f540ff]' },
        { name: 'Navy Blue', hex: '#0e1745', bgClass: 'bg-[#0e1745]' },
        { name: 'Negro', hex: '#0f0f0f', bgClass: 'bg-[#0f0f0f]' },
    ];

    const currentVariant = allVariants[activeIndex];
    const nextIndex = (activeIndex + 1) % allVariants.length;
    const nextVariant = allVariants[nextIndex];

    // Handle download with color modification
    const handleDownload = async () => {
        if (!downloadVariant) return;

        try {
            const response = await fetch(downloadVariant.file);
            let svgText = await response.text();

            // Replace white fill with selected color
            svgText = svgText.replace(/fill:\s*#fff;?/gi, `fill: ${selectedColor};`);
            svgText = svgText.replace(/fill="#fff"/gi, `fill="${selectedColor}"`);
            svgText = svgText.replace(/fill="#ffffff"/gi, `fill="${selectedColor}"`);
            svgText = svgText.replace(/fill:\s*#ffffff;?/gi, `fill: ${selectedColor};`);

            // Create blob and download
            const blob = new Blob([svgText], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shift-${downloadVariant.label.toLowerCase()}-${selectedColor.replace('#', '')}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setDownloadModalOpen(false);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const openDownloadModal = (variant: typeof allVariants[0]) => {
        setDownloadVariant(variant);
        setSelectedColor('#ffffff');
        setDownloadModalOpen(true);
    };

    return (
        <section className="w-full">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-tertiary flex items-center justify-center shadow-lg">
                    <BoxSelect size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-tertiary font-figtree">Sistema de Logo</h3>
                    <p className="text-gray-500 text-sm mt-1">Arquitectura responsiva de nuestra identidad visual</p>
                </div>
            </div>

            {/* Interactive Logo Explorer - Main Stage */}
            <div className="relative rounded-[2rem] bg-tertiary overflow-hidden mb-12 shadow-2xl">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/30 blur-[100px] rounded-full" />

                {/* Content - Three Column Layout */}
                <div className="relative z-10 p-8 md:p-12">
                    <div className="grid grid-cols-12 gap-8 min-h-[320px]">

                        {/* Left Column - Current Logo Display */}
                        <div className="col-span-12 md:col-span-4 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, scale: 0.9, x: -20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                    className="flex flex-col items-center"
                                >
                                    <img
                                        src={currentVariant.file}
                                        alt={currentVariant.label}
                                        className="h-20 md:h-28 w-auto object-contain mb-4"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Center Column - Description + Slider */}
                        <div className="col-span-12 md:col-span-4 flex flex-col justify-between border-l border-r border-white/10 px-8">
                            <div>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Title */}
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <h4 className="text-3xl font-bold text-white font-figtree">{currentVariant.label}</h4>
                                            <span className="text-white/40 text-xs font-mono">{currentVariant.minWidth}</span>
                                        </div>

                                        {/* Tag */}
                                        <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-[10px] font-bold text-secondary uppercase tracking-wider mb-4">
                                            {currentVariant.tag}
                                        </span>

                                        {/* Description */}
                                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                                            {currentVariant.description}
                                        </p>

                                        {/* Usage */}
                                        <p className="text-white/40 text-xs">
                                            <span className="text-white/60 font-bold">Uso:</span> {currentVariant.usage}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Slider Control */}
                            <div className="mt-8">
                                <div className="relative">
                                    {/* Slider Track */}
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                            animate={{ width: `${((activeIndex + 1) / allVariants.length) * 100}%` }}
                                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                        />
                                    </div>

                                    {/* Slider Input */}
                                    <input
                                        type="range"
                                        min="0"
                                        max={allVariants.length - 1}
                                        value={activeIndex}
                                        onChange={(e) => setActiveIndex(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />

                                    {/* Dots */}
                                    <div className="flex justify-between mt-3">
                                        {allVariants.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex
                                                        ? 'bg-secondary scale-150'
                                                        : idx < activeIndex
                                                            ? 'bg-primary'
                                                            : 'bg-white/20 hover:bg-white/40'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Progress Label */}
                                <div className="flex justify-between mt-4 text-[10px] text-white/40 font-mono">
                                    <span>{currentVariant.ratio}</span>
                                    <span>{activeIndex + 1} / {allVariants.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Next Preview */}
                        <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-center opacity-50 hover:opacity-80 transition-opacity cursor-pointer"
                            onClick={() => setActiveIndex(nextIndex)}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={nextIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center"
                                >
                                    <img
                                        src={nextVariant.file}
                                        alt={nextVariant.label}
                                        className="h-16 md:h-20 w-auto object-contain mb-4 grayscale"
                                    />
                                    <div className="text-center">
                                        <h5 className="text-lg font-bold text-white/60 font-figtree flex items-center gap-2">
                                            {nextVariant.label}
                                            <span className="text-white/30 text-xs font-mono">{nextVariant.minWidth}</span>
                                        </h5>
                                        <span className="text-[10px] text-white/40 uppercase tracking-wider">
                                            {nextVariant.tag}
                                        </span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Logotype Variants Card */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg overflow-hidden">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                        <h4 className="font-bold text-tertiary text-lg font-figtree flex items-center gap-2">
                            <Type size={18} className="text-primary" />
                            Logotipo
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">Versiones con tipografía completa</p>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {allVariants.slice(0, 3).map((variant, index) => (
                            <div key={index} className="p-6 flex items-center gap-6 group hover:bg-gray-50/50 transition-colors">
                                {/* Logo preview on dark background */}
                                <div className="w-32 h-20 bg-tertiary rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <img
                                        src={variant.file}
                                        alt={variant.label}
                                        className="h-10 w-auto object-contain"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h5 className="font-bold text-gray-900 text-sm">{variant.label}</h5>
                                        <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-500 uppercase">
                                            {variant.tag.split(' ')[0]}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">{variant.usage}</p>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={() => openDownloadModal(variant)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-sm font-bold"
                                >
                                    <Download size={14} />
                                    <span className="hidden md:inline">Descargar</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Isotype Variants Card */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg overflow-hidden">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                        <h4 className="font-bold text-tertiary text-lg font-figtree flex items-center gap-2">
                            <BoxSelect size={18} className="text-secondary" />
                            Isotipo
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">Símbolo gráfico aislado</p>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {allVariants.slice(3).map((variant, index) => (
                            <div key={index} className="p-6 flex items-center gap-6 group hover:bg-gray-50/50 transition-colors">
                                {/* Logo preview on dark background */}
                                <div className="w-32 h-20 bg-tertiary rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <img
                                        src={variant.file}
                                        alt={variant.label}
                                        className="h-10 w-auto object-contain"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h5 className="font-bold text-gray-900 text-sm">{variant.label}</h5>
                                        <span className="px-2 py-0.5 rounded bg-secondary/10 text-[10px] font-bold text-secondary uppercase">
                                            {variant.tag.split(' ')[0]}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">{variant.usage}</p>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={() => openDownloadModal(variant)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all text-sm font-bold"
                                >
                                    <Download size={14} />
                                    <span className="hidden md:inline">Descargar</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Additional info panel */}
                    <div className="bg-gradient-to-r from-secondary/5 to-primary/5 px-8 py-6 border-t border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Ratio size={16} className="text-secondary" />
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900 text-sm mb-1">Regla de Espacio Claro</h5>
                                <p className="text-xs text-gray-500">
                                    El isotipo debe mantener un espacio libre equivalente al 25% de su altura en todos sus lados para garantizar legibilidad e impacto visual.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Modal with Color Picker */}
            <AnimatePresence>
                {downloadModalOpen && downloadVariant && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setDownloadModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-tertiary p-8 text-center">
                                <div className="mb-4 h-20 flex items-center justify-center">
                                    {/* Preview with selected color - using CSS filter for preview */}
                                    <div
                                        className="h-16 w-auto"
                                        style={{
                                            filter: selectedColor === '#ffffff' ? 'none' :
                                                selectedColor === '#0f0f0f' ? 'brightness(0)' :
                                                    `brightness(0) saturate(100%) ${selectedColor === '#1534dc' ? 'invert(18%) sepia(98%) saturate(7489%) hue-rotate(230deg) brightness(88%) contrast(100%)' :
                                                        selectedColor === '#f540ff' ? 'invert(39%) sepia(100%) saturate(7455%) hue-rotate(289deg) brightness(101%) contrast(101%)' :
                                                            selectedColor === '#0e1745' ? 'invert(8%) sepia(53%) saturate(3574%) hue-rotate(218deg) brightness(94%) contrast(102%)' :
                                                                'none'
                                                    }`
                                        }}
                                    >
                                        <img
                                            src={downloadVariant.file}
                                            alt={downloadVariant.label}
                                            className="h-full w-auto object-contain"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white font-figtree">{downloadVariant.label}</h3>
                                <p className="text-white/60 text-sm mt-1">{downloadVariant.tag}</p>
                            </div>

                            {/* Color Picker */}
                            <div className="p-8">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                                    Selecciona el color de descarga
                                </h4>

                                <div className="flex flex-wrap gap-3 mb-8">
                                    {brandColors.map((color) => (
                                        <button
                                            key={color.hex}
                                            onClick={() => setSelectedColor(color.hex)}
                                            className={`relative w-12 h-12 rounded-xl ${color.bgClass} transition-all duration-200 ${selectedColor === color.hex
                                                    ? 'ring-2 ring-offset-2 ring-secondary scale-110'
                                                    : 'hover:scale-105'
                                                }`}
                                            title={color.name}
                                        >
                                            {selectedColor === color.hex && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute inset-0 flex items-center justify-center"
                                                >
                                                    <Check size={16} className={color.hex === '#ffffff' || color.hex === '#f540ff' ? 'text-tertiary' : 'text-white'} />
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                                    <span>Color seleccionado:</span>
                                    <span className="font-mono font-bold text-tertiary">{selectedColor.toUpperCase()}</span>
                                </div>

                                {/* Download Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDownloadModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <Download size={16} />
                                        Descargar SVG
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

const GuidelinesView: React.FC = () => {
    const [previewText, setPreviewText] = useState("");
    const [isInputHovered, setIsInputHovered] = useState(false);
    const [isCardHovered, setIsCardHovered] = useState(false);
    const isGlowActive = isInputHovered || isCardHovered;

    return (
        <div className="space-y-16 pb-20">
            {/* Intro Section */}
            <section className="relative rounded-[2.5rem] overflow-hidden bg-tertiary text-white p-10 md:p-16 shadow-2xl min-h-[400px] flex items-center">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src="/videos/espiral.mp4" type="video/mp4" />
                </video>

                {/* Soft Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 z-[1]" />

                {/* Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-20 blur-[100px] rounded-full pointer-events-none z-[1]" />

                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider uppercase mb-4">
                        Sistema de Diseño v2.0
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Echo & Resonance</h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Nuestra identidad visual se basa en la amplificación. Como una onda de sonido que se expande,
                        nuestra marca es dinámica, vibrante y diseñada para generar impacto.
                    </p>
                </div>
            </section>

            {/* Logo System Section - Top Tier Design */}
            <LogoSystem />

            {/* Typography Section */}
            <section>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Type size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-tertiary">Tipografía Corporativa</h3>
                            <p className="text-gray-500 text-sm mt-1">Nuestra voz visual expresada en tres niveles.</p>
                        </div>
                    </div>

                    {/* Interactive Type Tester */}
                    <div className="relative w-full md:w-96 group/input">
                        <div className={`absolute -inset-1 bg-secondary rounded-xl blur-lg transition-opacity duration-300 ${isGlowActive ? 'opacity-40' : 'opacity-0'}`} />
                        <div className="relative bg-white rounded-xl border border-gray-200 flex items-center shadow-sm z-10">
                            <div className="pl-4 text-gray-400">
                                <span className="font-serif italic text-lg">Aa</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Probá tus titulares aquí..."
                                value={previewText}
                                onChange={(e) => setPreviewText(e.target.value)}
                                onMouseEnter={() => setIsInputHovered(true)}
                                onMouseLeave={() => setIsInputHovered(false)}
                                className="w-full pl-3 pr-4 py-3 bg-transparent rounded-xl text-sm focus:outline-none text-gray-800 placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                    <TypographyCard
                        name="Glitz" role="Display & Impacto" description="Nuestra voz más expresiva. Se utiliza exclusivamente para grandes titulares que necesitan evocar personalidad y modernidad."
                        usage={["Headlines (+48px)", "Momentos 'Wow'", "Portadas"]} weights={["Regular"]} fontClass="font-glitz"
                        previewText={previewText} defaultText="Resonancia Pura Vida." isDark={true}
                        downloadUrl="/Glitz-Regular.otf" isExternalDownload={false}
                        isInputHovered={isGlowActive} onHoverStart={() => setIsCardHovered(true)} onHoverEnd={() => setIsCardHovered(false)}
                    />
                    <TypographyCard
                        name="Figtree" role="Estructura & Títulos" description="Geométrica pero amigable. Es el caballo de batalla para la jerarquía de la información."
                        usage={["Títulos de sección", "Subtítulos", "Botones y UI"]} weights={["Bold (700)", "Medium (500)"]} fontClass="font-figtree font-bold"
                        previewText={previewText} defaultText="Impacto que trasciende fronteras." isInputHovered={isGlowActive}
                        downloadUrl="https://fonts.google.com/specimen/Figtree" isExternalDownload={true}
                        onHoverStart={() => setIsCardHovered(true)} onHoverEnd={() => setIsCardHovered(false)}
                    />
                    <TypographyCard
                        name="Mozilla Text" role="Lectura & Cuerpo" description="Optimizada para la legibilidad en tamaños pequeños y bloques de texto densos. (Fira Sans)"
                        usage={["Párrafos", "Textos legales", "Captions"]} weights={["Regular (400)", "Light (300)"]} fontClass="font-mozilla"
                        previewText={previewText} defaultText="Desde San José para el mundo, amplificamos historias que generan eco. Creamos sintonía con el futuro." isInputHovered={isGlowActive}
                        downloadUrl="https://fonts.google.com/specimen/Fira+Sans" isExternalDownload={true}
                        onHoverStart={() => setIsCardHovered(true)} onHoverEnd={() => setIsCardHovered(false)}
                    />
                </div>
                <HierarchyShowcase />
            </section>

            {/* Colors Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                        <Droplet size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-tertiary">Paleta Cromática</h3>
                </div>

                {/* 1. ATOMIZATION: All Colors Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    {/* Row 1: Primary Spectrum */}
                    <ColorSwatch name="Royal Blue" hex="#1534dc" color="primary" label="Primary" />
                    <ColorSwatch name="Magenta" hex="#f540ff" color="secondary" label="Secondary" />
                    <ColorSwatch name="Navy Blue" hex="#0e1745" color="tertiary" label="Tertiary" />
                    <ColorSwatch name="Deep Black" hex="#0f0f0f" color="black" label="Neutral" />
                    <ColorSwatch name="Surface White" hex="#edf0fe" color="white" label="Surface" />

                    {/* Row 2: Secondary Shades */}
                    <ColorSwatch name="Deep Blue" hex="#002e6d" color="deep-blue" label="Shade" />
                    <ColorSwatch name="Bright Blue" hex="#3c55d8" color="bright-blue" label="Highlight" />
                    <ColorSwatch name="Amethyst" hex="#9244d8" color="amethyst" label="Accent" />
                    <ColorSwatch name="Pure White" hex="#ffffff" color="pure-white" label="Base" />
                    {/* Empty placeholder to fill grid or another shade */}
                    <div className="hidden lg:flex flex-col items-center justify-center border border-secondary/20 rounded-2xl bg-secondary/5 group relative overflow-hidden transition-all hover:bg-secondary/10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-secondary/10 to-transparent animate-[shimmer_2s_infinite]" />
                        <Sparkles size={16} className="text-secondary/40 mb-1" />
                        <span className="text-[10px] font-bold text-secondary/50 uppercase tracking-widest">Resonancia Alpha</span>
                    </div>
                </div>

                {/* 2. PROPORTION: Distribution Chart */}
                <div className="mb-12">
                    <ColorDistribution />
                </div>

                {/* 3. FUSION: Gradients */}
                <div className="mb-12">
                    <h4 className="font-bold text-tertiary mb-6 flex items-center gap-2 text-lg">
                        <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                        Gradientes Corporativos
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Gradient 1: Classic Brand */}
                        <div className="group rounded-[2rem] bg-white border border-gray-100 p-2 shadow-lg hover:shadow-xl transition-all">
                            <div className="relative h-32 rounded-[1.5rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden"></div>
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-gray-800 text-sm">Diagonal Principal</h4>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">to-br</span>
                                </div>
                                <CopyTrigger value="bg-gradient-to-br from-[#1534dc] to-[#f540ff]" className="block">
                                    <div className="bg-gray-50 rounded-lg p-3 font-mono text-[10px] text-gray-500 border border-gray-100 flex justify-between items-center group/code hover:bg-white hover:border-primary/20 transition-colors">
                                        <code className="truncate">from-[#1534dc] to-[#f540ff]</code>
                                        <Copy size={12} className="cursor-pointer text-gray-400 group-hover/code:text-primary" />
                                    </div>
                                </CopyTrigger>
                            </div>
                        </div>

                        {/* Gradient 2: Deep Corporate */}
                        <div className="group rounded-[2rem] bg-white border border-gray-100 p-2 shadow-lg hover:shadow-xl transition-all">
                            <div className="relative h-32 rounded-[1.5rem] bg-gradient-to-b from-tertiary to-primary flex items-center justify-center overflow-hidden"></div>
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-gray-800 text-sm">Vertical Profundo</h4>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">to-b</span>
                                </div>
                                <CopyTrigger value="bg-gradient-to-b from-[#0e1745] to-[#1534dc]" className="block">
                                    <div className="bg-gray-50 rounded-lg p-3 font-mono text-[10px] text-gray-500 border border-gray-100 flex justify-between items-center group/code hover:bg-white hover:border-primary/20 transition-colors">
                                        <code className="truncate">from-[#0e1745] to-[#1534dc]</code>
                                        <Copy size={12} className="cursor-pointer text-gray-400 group-hover/code:text-primary" />
                                    </div>
                                </CopyTrigger>
                            </div>
                        </div>

                        {/* Gradient 3 - New: White/Light (SOFTENED) */}
                        <div className="group rounded-[2rem] bg-white border border-gray-100 p-2 shadow-lg hover:shadow-xl transition-all">
                            <div className="relative h-32 rounded-[1.5rem] bg-gradient-to-bl from-white via-[#f5f7ff] to-[#cdd5f8] flex items-center justify-center overflow-hidden border border-gray-100"></div>
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-gray-800 text-sm">Clean Air</h4>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">to-bl (soft)</span>
                                </div>
                                <CopyTrigger value="bg-gradient-to-bl from-white via-[#f5f7ff] to-[#cdd5f8]" className="block">
                                    <div className="bg-gray-50 rounded-lg p-3 font-mono text-[10px] text-gray-500 border border-gray-100 flex justify-between items-center group/code hover:bg-white hover:border-primary/20 transition-colors">
                                        <code className="truncate">from-white to-[#cdd5f8]</code>
                                        <Copy size={12} className="cursor-pointer text-gray-400 group-hover/code:text-primary" />
                                    </div>
                                </CopyTrigger>
                            </div>
                        </div>

                        {/* Gradient 4 - New: Dark/Amethyst */}
                        <div className="group rounded-[2rem] bg-white border border-gray-100 p-2 shadow-lg hover:shadow-xl transition-all">
                            <div className="relative h-32 rounded-[1.5rem] bg-gradient-to-tr from-[#0f0f0f] via-[#0e1745] to-[#9244d8] flex items-center justify-center overflow-hidden"></div>
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-gray-800 text-sm">Deep Resonance</h4>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">to-tr (dark)</span>
                                </div>
                                <CopyTrigger value="bg-gradient-to-tr from-[#0f0f0f] via-[#0e1745] to-[#9244d8]" className="block">
                                    <div className="bg-gray-50 rounded-lg p-3 font-mono text-[10px] text-gray-500 border border-gray-100 flex justify-between items-center group/code hover:bg-white hover:border-primary/20 transition-colors">
                                        <code className="truncate">...via-[#0e1745] to-[#9244d8]</code>
                                        <Copy size={12} className="cursor-pointer text-gray-400 group-hover/code:text-primary" />
                                    </div>
                                </CopyTrigger>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            {/* Spacing / Layout - GOLDEN RATIO UPDATE */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <Layout size={24} />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-bold text-tertiary">Espaciado y Proporción</h3>
                        <p className="text-sm text-gray-500">La matemática de la naturaleza aplicada al diseño.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Golden Ratio Explanation */}
                    <div className="rounded-[2.5rem] bg-tertiary text-white p-8 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Scaling size={20} className="text-secondary" />
                                <h4 className="font-bold uppercase tracking-widest text-xs opacity-70">Número Áureo (Phi)</h4>
                            </div>
                            <h3 className="text-3xl font-bold mb-4">1.618</h3>
                            <p className="text-white/70 leading-relaxed mb-6 text-sm">
                                Abandonamos el grid lineal arbitrario. Usamos el <strong>Grid de Fibonacci</strong>.
                                Cada elemento en nuestro sistema se deriva multiplicando o dividiendo por 1.618,
                                creando una armonía natural que el ojo humano percibe como "correcta" instintivamente.
                            </p>
                        </div>
                        <div className="relative z-10 mt-auto flex justify-center">
                            <GoldenSpiral />
                        </div>
                    </div>

                    {/* Scale Visualization */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] border border-gray-200 p-8">
                            <h4 className="font-bold text-tertiary mb-6 flex items-center gap-2">
                                <Ratio size={18} className="text-primary" />
                                Escala Modular (Base 16px)
                            </h4>
                            <div className="space-y-4">
                                {/* Scale Items */}
                                <div className="flex items-center gap-4 group">
                                    <CopyTrigger value="1.000" className="w-24 text-right text-xs text-gray-400 font-mono group-hover:text-primary transition-colors">
                                        1.000 (Base)
                                    </CopyTrigger>
                                    <div className="h-4 bg-primary w-4 rounded shadow-sm" />
                                    <CopyTrigger value="16px" className="text-sm font-bold text-tertiary hover:text-secondary transition-colors">
                                        16px
                                    </CopyTrigger>
                                    <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Paragraph</span>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <CopyTrigger value="1.618" className="w-24 text-right text-xs text-gray-400 font-mono group-hover:text-primary transition-colors">
                                        1.618 (φ)
                                    </CopyTrigger>
                                    <div className="h-6 bg-primary/80 w-6 rounded shadow-sm" />
                                    <CopyTrigger value="26px" className="text-sm font-bold text-tertiary hover:text-secondary transition-colors">
                                        ~26px
                                    </CopyTrigger>
                                    <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Subheaders</span>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <CopyTrigger value="2.618" className="w-24 text-right text-xs text-gray-400 font-mono group-hover:text-primary transition-colors">
                                        2.618 (φ²)
                                    </CopyTrigger>
                                    <div className="h-10 bg-primary/60 w-10 rounded shadow-sm" />
                                    <CopyTrigger value="42px" className="text-sm font-bold text-tertiary hover:text-secondary transition-colors">
                                        ~42px
                                    </CopyTrigger>
                                    <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Section Titles</span>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <CopyTrigger value="4.236" className="w-24 text-right text-xs text-gray-400 font-mono group-hover:text-primary transition-colors">
                                        4.236 (φ³)
                                    </CopyTrigger>
                                    <div className="h-16 bg-primary/40 w-16 rounded shadow-sm" />
                                    <CopyTrigger value="68px" className="text-sm font-bold text-tertiary hover:text-secondary transition-colors">
                                        ~68px
                                    </CopyTrigger>
                                    <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Hero Display</span>
                                </div>
                            </div>
                        </div>

                        {/* New Powers Section */}
                        <PhiPowers />
                    </div>
                </div>

                {/* UX Mocks for Golden Ratio Application */}
                <h4 className="text-xl font-bold text-tertiary mb-6 px-2">Aplicación en Layouts</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <LayoutMock type="slide-columns" title="Golden Grid (Columnas)" />
                    <LayoutMock type="slide-grid" title="Margen & Gutter" />
                    <LayoutMock type="doc-letter" title="Documento (Phi³)" />
                </div>
            </section>
        </div>
    );
};

export default GuidelinesView;