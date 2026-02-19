import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import GeneratingOverlay from "./GeneratingOverlay";
import { BrandCanvas } from "./GenAIModule/BrandCanvas";
import type { GenerationPhase } from "../../hooks/useBrandGeneration";
import type { GenerationResult } from "../../services/imagenService";

interface Props {
    phase: GenerationPhase;
    phaseMessage: string;
    currentImage: GenerationResult | null;
    onDownload: () => void;
    onRegenerate: () => void;
}

const CanvasPanel: React.FC<Props> = ({
    phase,
    phaseMessage,
    currentImage,
    onDownload,
    onRegenerate,
}) => {
    const [zoomed, setZoomed] = React.useState(false);

    return (
        <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Canvas Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/10 shrink-0">
                <h3 className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase">
                    Canvas
                </h3>
                {currentImage && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setZoomed(!zoomed)}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            title={zoomed ? "Zoom Out" : "Zoom In"}
                        >
                            {zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
                        </button>
                        <button
                            onClick={onRegenerate}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            title="Regenerar"
                        >
                            <RefreshCw size={16} />
                        </button>
                        <button
                            onClick={onDownload}
                            className="p-2 rounded-lg hover:bg-[#f540ff]/20 text-[#f540ff] hover:text-[#f540ff] transition-colors"
                            title="Descargar"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
                {/* Generating Overlay */}
                <AnimatePresence>
                    {(phase === "art-directing" || phase === "generating") && (
                        <GeneratingOverlay phase={phase} message={phaseMessage} />
                    )}
                </AnimatePresence>

                {/* Generated Image */}
                {currentImage ? (
                    currentImage.analysis ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <BrandCanvas
                                layoutId={currentImage.analysis.layoutId}
                                imageSrc={currentImage.imageBase64}
                                headline={currentImage.analysis.headline}
                                subheadline={currentImage.analysis.subheadline}
                                logoVariant={currentImage.analysis.logoVariant}
                                scale={zoomed ? 0.75 : 0.45}
                            />
                        </div>
                    ) : (
                        <motion.img
                            key={currentImage.timestamp}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: zoomed ? 1.5 : 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            src={`data:image/png;base64,${currentImage.imageBase64}`}
                            alt="Generated brand asset"
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl shadow-black/40 cursor-zoom-in transition-transform duration-300"
                            onClick={() => setZoomed(!zoomed)}
                            draggable={false}
                        />
                    )
                ) : (
                    /* Empty State — Fibonacci Spiral */
                    <div className="flex flex-col items-center justify-center gap-6 select-none">
                        <motion.svg
                            width="200"
                            height="200"
                            viewBox="0 0 200 200"
                            fill="none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="opacity-20"
                        >
                            {/* Fibonacci spiral approximation using arcs */}
                            <path
                                d="M100,100 
                   a5,5 0 0,1 5,5 
                   a8,8 0 0,1 -8,8 
                   a13,13 0 0,1 -13,-13 
                   a21,21 0 0,1 21,-21 
                   a34,34 0 0,1 34,34 
                   a55,55 0 0,1 -55,55 
                   a89,89 0 0,1 -70,-89"
                                stroke="#1534dc"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                            {/* Inner circle */}
                            <circle cx="100" cy="100" r="3" fill="#1534dc" opacity="0.6" />
                            {/* Accent dots on Fibonacci points */}
                            <circle cx="105" cy="105" r="1.5" fill="#f540ff" opacity="0.8" />
                            <circle cx="97" cy="113" r="2" fill="#f540ff" opacity="0.6" />
                            <circle cx="84" cy="100" r="2.5" fill="#1534dc" opacity="0.5" />
                            <circle cx="105" cy="79" r="3" fill="#1534dc" opacity="0.4" />
                        </motion.svg>

                        <div className="text-center">
                            <p className="text-white/30 text-sm font-medium mb-1">
                                Tu lienzo está listo
                            </p>
                            <p className="text-white/20 text-xs">
                                Describe tu concepto y selecciona el estilo →
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CanvasPanel;
