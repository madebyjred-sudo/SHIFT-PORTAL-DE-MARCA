import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import type { HistoryEntry } from "../../hooks/useBrandGeneration";

interface Props {
    history: HistoryEntry[];
    onSelect: (entry: HistoryEntry) => void;
    isCollapsed: boolean;
    onToggle: () => void;
}

const BrandMemoryPanel: React.FC<Props> = ({
    history,
    onSelect,
    isCollapsed,
    onToggle,
}) => {
    return (
        <>
            {/* Toggle Button (visible on all sizes) */}
            <button
                onClick={onToggle}
                className="absolute top-1/2 -translate-y-1/2 left-0 z-20 p-1.5 bg-white/10 hover:bg-white/20 rounded-r-lg border border-l-0 border-white/10 text-white/50 hover:text-white transition-all hidden lg:flex items-center"
                style={{ left: isCollapsed ? 0 : 240 }}
                title={isCollapsed ? "Mostrar historial" : "Ocultar historial"}
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 240, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="hidden lg:flex shrink-0 flex-col border-r border-white/10 overflow-hidden bg-black/20"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-white/10 flex items-center gap-2 shrink-0">
                            <Clock size={13} className="text-white/40" />
                            <h3 className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase">
                                Brand Memory
                            </h3>
                        </div>

                        {/* History List */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-2">
                            {history.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                                        <Clock size={18} className="text-white/20" />
                                    </div>
                                    <p className="text-white/25 text-xs leading-relaxed">
                                        Tus creaciones aparecerán aquí
                                    </p>
                                </div>
                            ) : (
                                history.map((entry, idx) => (
                                    <motion.button
                                        key={entry.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => onSelect(entry)}
                                        className="w-full group relative rounded-xl overflow-hidden border border-white/10 hover:border-[#f540ff]/30 transition-all aspect-video bg-black/30"
                                    >
                                        <img
                                            src={`data:image/png;base64,${entry.imageBase64}`}
                                            alt={entry.concept}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                        {/* Overlay info */}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                            <p className="text-white/80 text-[10px] font-medium truncate">
                                                {entry.concept}
                                            </p>
                                            <p className="text-white/40 text-[9px]">
                                                {new Date(entry.timestamp).toLocaleTimeString("es", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </motion.button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BrandMemoryPanel;
