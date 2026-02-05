import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Image as ImageIcon, Box, ArrowRight } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { Asset } from '../types';

interface SearchResultsProps {
    onNavigate: (view: any, params?: any) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ onNavigate }) => {
    const { query, results, isOpen, setIsOpen, clearSearch } = useSearch();
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    if (!isOpen || query.length < 2) return null;

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'image': return <ImageIcon size={16} className="text-purple-400" />;
            case 'template': return <FileText size={16} className="text-blue-400" />;
            case 'logo': return <Box size={16} className="text-pink-400" />;
            default: return <Search size={16} className="text-gray-400" />;
        }
    };

    const handleResultClick = (asset: Asset) => {
        setIsOpen(false);

        // Smart routing based on asset type
        if (asset.type === 'template') {
            onNavigate('templates');
        } else {
            // Default to assets view with category filter
            onNavigate('assets', {
                category: asset.category,
                assetId: asset.id
            });
        }
    };



    return (
        <AnimatePresence>
            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full mt-2 left-0 right-0 bg-[#0f0c29]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[60vh] flex flex-col"
            >
                <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider px-2">
                        {results.length} Resultados para "{query}"
                    </span>
                    <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/20">
                    {results.length === 0 ? (
                        <div className="py-8 text-center text-white/40">
                            <Search size={32} className="mx-auto mb-3 opacity-50" />
                            <p>No encontramos resultados para "{query}"</p>
                            <p className="text-xs mt-2 text-white/30">Probá con 'Logos', 'Presentaciones' o 'Iconos'</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {results.map((result) => (
                                <button
                                    key={result.item.id}
                                    onClick={() => handleResultClick(result.item)}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors group text-left w-full"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden bg-white/5 p-1">
                                        {result.item.previewUrl ? (
                                            <img src={result.item.previewUrl} alt="" className="w-full h-full object-contain" />
                                        ) : (
                                            getIcon(result.item.type)
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium truncate group-hover:text-blue-300 transition-colors">
                                            {result.item.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <span className="bg-white/10 px-1.5 py-0.5 rounded uppercase text-[10px] tracking-wider text-white/60">
                                                {result.item.format}
                                            </span>
                                            {result.item.category && (
                                                <>
                                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                                    <span>{result.item.category}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40">
                                        <ArrowRight size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SearchResults;
