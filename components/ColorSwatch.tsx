import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface ColorSwatchProps {
    color?: string;
    name: string;
    hex: string;
    label?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, hex, label }) => {
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
