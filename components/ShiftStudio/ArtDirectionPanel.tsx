import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Users, Leaf, Box, Layers } from "lucide-react";
import { FORMAT_OPTIONS, CATEGORY_OPTIONS, FormatId, CategoryId } from "../../services/imagenService";
import type { GenerationPhase } from "../../hooks/useBrandGeneration";

interface Props {
    onGenerate: (concept: string, format: FormatId, category: CategoryId) => void;
    onGenerateComposite: (prompt: string) => void;
    phase: GenerationPhase;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "category_people": <Users size={20} />,
    "category_nature": <Leaf size={20} />,
    "category_objects": <Box size={20} />,
    "category_abstract": <Layers size={20} />,
};

const ArtDirectionPanel: React.FC<Props> = ({ onGenerate, onGenerateComposite, phase }) => {
    const [concept, setConcept] = useState("");
    const [selectedFormat, setSelectedFormat] = useState<FormatId>("presentation");
    const [selectedCategory, setSelectedCategory] = useState<CategoryId>("category_people");
    const [isAutoPilot, setIsAutoPilot] = useState(false);

    const isGenerating = phase === "art-directing" || phase === "generating" || phase === "analyzing";
    const canGenerate = concept.trim().length > 2 && !isGenerating;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canGenerate) return;

        if (isAutoPilot) {
            onGenerateComposite(concept.trim());
        } else {
            onGenerate(concept.trim(), selectedFormat, selectedCategory);
        }
    };

    return (
        <div className="w-full lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/10 shrink-0">
                <h3 className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase">
                    Dirección Creativa
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 md:p-8 gap-5 overflow-y-auto">
                {/* Concept Textarea */}
                <div>
                    <label className="block text-white/70 text-xs font-semibold mb-2 tracking-wide">
                        Concepto
                    </label>
                    <textarea
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder="Describe el asset (ej: 'Equipo revisando planos' o 'Laptop en escritorio moderno')"
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-[#f540ff]/40 focus:bg-white/[0.07] transition-all"
                        disabled={isGenerating}
                    />
                </div>

                {/* Auto-Pilot Toggle */}
                <div
                    onClick={() => !isGenerating && setIsAutoPilot(!isAutoPilot)}
                    className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border transition-all ${isAutoPilot ? 'bg-[#1534dc]/10 border-[#1534dc]/40' : 'bg-white/5 border-white/10'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${isAutoPilot ? 'bg-[#1534dc] text-white' : 'bg-white/10 text-white/40'}`}>
                            <Zap size={18} fill={isAutoPilot ? "currentColor" : "none"} />
                        </div>
                        <div>
                            <h3 className="text-white text-sm font-bold">GenAI Auto-Pilot</h3>
                            <p className="text-white/40 text-[10px]">La IA elige el mejor layout</p>
                        </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${isAutoPilot ? 'bg-[#1534dc]' : 'bg-white/20'}`}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isAutoPilot ? 'left-6' : 'left-1'}`} />
                    </div>
                </div>

                {!isAutoPilot && (
                    <>
                        {/* Format Grid */}
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <label className="block text-white/70 text-xs font-semibold mb-2 tracking-wide">
                                Formato
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {FORMAT_OPTIONS.map((fmt) => (
                                    <button
                                        key={fmt.id}
                                        type="button"
                                        onClick={() => setSelectedFormat(fmt.id)}
                                        disabled={isGenerating}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${selectedFormat === fmt.id
                                            ? "bg-[#1534dc]/20 border-[#1534dc]/50 text-white shadow-[0_0_15px_rgba(21,52,220,0.2)]"
                                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70"
                                            }`}
                                    >
                                        <span className="text-lg">{fmt.icon}</span>
                                        <span className="leading-tight text-center">{fmt.label}</span>
                                        <span className="text-[10px] text-white/30">{fmt.ratio}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Category Cards (Old Vibe) */}
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <label className="block text-white/70 text-xs font-semibold mb-2 tracking-wide mt-5">
                                Categoría de Contenido
                            </label>
                            <div className="flex flex-col gap-2">
                                {CATEGORY_OPTIONS.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat.id)}
                                        disabled={isGenerating}
                                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${selectedCategory === cat.id
                                            ? "bg-gradient-to-r from-[#f540ff]/15 to-[#1534dc]/15 border-[#f540ff]/40 text-white shadow-[0_0_20px_rgba(245,64,255,0.15)]"
                                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70"
                                            }`}
                                    >
                                        <span className={`text-lg shrink-0 mt-0.5 ${selectedCategory === cat.id ? 'text-[#f540ff]' : 'text-white/40'}`}>
                                            {CATEGORY_ICONS[cat.id]}
                                        </span>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-semibold">{cat.label}</span>
                                            <span className="text-[10px] text-white/40 leading-tight">{cat.description}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Generate Button */}
                <motion.button
                    type="submit"
                    disabled={!canGenerate}
                    whileTap={canGenerate ? { scale: 0.97 } : undefined}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${canGenerate
                        ? "bg-gradient-to-r from-[#1534dc] to-[#f540ff] text-white shadow-[0_4px_25px_rgba(245,64,255,0.4)] hover:shadow-[0_4px_35px_rgba(245,64,255,0.6)]"
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                        }`}
                >
                    <Sparkles size={16} />
                    {isGenerating ? "Generando…" : (isAutoPilot ? "Crear con Arquitecto IA" : "Generar Visual")}
                </motion.button>
            </form>
        </div>
    );
};

export default ArtDirectionPanel;
