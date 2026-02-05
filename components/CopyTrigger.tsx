import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface CopyTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const CopyTrigger: React.FC<CopyTriggerProps> = ({ value, children, className = "" }) => {
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
