import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    phase: "art-directing" | "generating";
    message: string;
}

const GeneratingOverlay: React.FC<Props> = ({ phase, message }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl"
        >
            {/* Radial pulse ring */}
            <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-2 border-[#f540ff]/40"
                />
                <motion.div
                    animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-[#1534dc]/30"
                />

                {/* Core orb */}
                <motion.div
                    animate={{
                        scale: phase === "generating" ? [1, 1.15, 1] : [1, 1.05, 1],
                        boxShadow:
                            phase === "generating"
                                ? [
                                    "0 0 30px rgba(245,64,255,0.4)",
                                    "0 0 60px rgba(245,64,255,0.7)",
                                    "0 0 30px rgba(245,64,255,0.4)",
                                ]
                                : [
                                    "0 0 20px rgba(21,52,220,0.4)",
                                    "0 0 40px rgba(21,52,220,0.7)",
                                    "0 0 20px rgba(21,52,220,0.4)",
                                ],
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${phase === "generating"
                            ? "bg-gradient-to-br from-[#f540ff] to-[#1534dc]"
                            : "bg-gradient-to-br from-[#1534dc] to-[#0e1745]"
                        }`}
                >
                    {phase === "art-directing" ? (
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                        </svg>
                    ) : (
                        <svg className="w-7 h-7 text-white animate-spin" style={{ animationDuration: "3s" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
                        </svg>
                    )}
                </motion.div>
            </div>

            {/* Phase label */}
            <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase mb-3">
                {phase === "art-directing" ? "Art Director" : "Imagen Studio"}
            </p>

            {/* Cycling message */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={message}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="text-white/80 text-sm font-medium text-center px-6 max-w-[280px]"
                >
                    {message}
                </motion.p>
            </AnimatePresence>
        </motion.div>
    );
};

export default GeneratingOverlay;
