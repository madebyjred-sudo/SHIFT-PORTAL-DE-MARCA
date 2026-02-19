import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wand2 } from "lucide-react";
import { useBrandGeneration } from "../../hooks/useBrandGeneration";
import CanvasPanel from "./CanvasPanel";
import ArtDirectionPanel from "./ArtDirectionPanel";
import BrandMemoryPanel from "./BrandMemoryPanel";

interface Props {
    onClose: () => void;
}

const ShiftStudio: React.FC<Props> = ({ onClose }) => {
    const {
        phase,
        phaseMessage,
        currentImage,
        history,
        error,
        generate,
        regenerate,
        selectFromHistory,
        downloadCurrent,
        generateComposite,
    } = useBrandGeneration();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
            className="absolute inset-0 z-20 flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#0e1745]/90 to-[#0a0a0a] overflow-hidden"
        >
            {/* Internal Decorative Glows */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1534dc]/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#f540ff]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Studio Header */}
            <div className="relative z-10 flex items-center gap-3 p-6 md:p-8 border-b border-white/10 shrink-0">
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title="Volver al chat"
                >
                    <ArrowLeft size={18} />
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1534dc] to-[#f540ff] flex items-center justify-center shadow-[0_0_12px_rgba(245,64,255,0.3)]">
                        <Wand2 size={14} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-white text-sm font-bold tracking-wide">
                            Shift Studio
                        </h2>
                        <p className="text-white/40 text-[10px] font-medium tracking-wider uppercase">
                            Generación Visual con IA
                        </p>
                    </div>
                </div>

                {/* Error Toast */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg"
                    >
                        <p className="text-red-300 text-[11px] font-medium max-w-[200px] truncate">
                            {error}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Three-Panel Layout */}
            <div className="relative z-10 flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
                {/* Left: Brand Memory (desktop only) */}
                <BrandMemoryPanel
                    history={history}
                    onSelect={selectFromHistory}
                    isCollapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                {/* Center: Canvas */}
                <CanvasPanel
                    phase={phase}
                    phaseMessage={phaseMessage}
                    currentImage={currentImage}
                    onDownload={downloadCurrent}
                    onRegenerate={regenerate}
                />

                {/* Right: Art Direction Controls */}
                <ArtDirectionPanel onGenerate={generate} onGenerateComposite={generateComposite} phase={phase} />
            </div>

            {/* Mobile History Bar (bottom strip on mobile) */}
            {history.length > 0 && (
                <div className="lg:hidden shrink-0 border-t border-white/10 bg-black/30 px-3 py-2">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {history.slice(0, 8).map((entry) => (
                            <button
                                key={entry.id}
                                onClick={() => selectFromHistory(entry)}
                                className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-white/10 hover:border-[#f540ff]/30 transition-all"
                            >
                                <img
                                    src={`data:image/png;base64,${entry.imageBase64}`}
                                    alt={entry.concept}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ShiftStudio;
