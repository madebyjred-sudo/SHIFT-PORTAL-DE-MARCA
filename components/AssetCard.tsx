import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Heart, Share2, Check } from 'lucide-react';
import { Asset } from '../types';
import { downloadSingleAsset } from '../services/downloadService';
import { useMsal, useAccount } from "@azure/msal-react";
import { loginRequest, isSimulationMode } from '../authConfig';

interface AssetCardProps {
    asset: Asset;
    isSelected?: boolean;
    onToggleSelection?: (id: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, isSelected = false, onToggleSelection }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // 1. Auth Check: If not logged in & not simulation, force login
        if (!account && !isSimulationMode()) {
            try {
                await instance.loginPopup(loginRequest);
                // Note: We don't auto-resume download here to avoid popup-blocker issues, 
                // but the UI will refresh to "Logged In" state.
                return;
            } catch (error) {
                console.error("Login failed during download attempt", error);
                return;
            }
        }

        // 2. Start Download Flow
        setIsDownloading(true);

        // Trigger download
        await downloadSingleAsset(asset);

        // Reset state
        setTimeout(() => {
            setIsDownloading(false);
        }, 2000);
    };

    const handleSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleSelection) {
            onToggleSelection(asset.id);
        }
    };

    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            animate={isSelected ? "selected" : "rest"}
            variants={{
                rest: {
                    y: 0,
                    scale: 1,
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                    borderColor: "transparent"
                },
                hover: {
                    y: -8,
                    scale: 1.01,
                    boxShadow: "0 20px 40px -5px rgba(0, 71, 171, 0.25), 0 10px 20px -5px rgba(255, 0, 255, 0.1)",
                    borderColor: "rgba(255, 0, 255, 0.2)"
                },
                selected: {
                    y: -4,
                    scale: 0.98,
                    boxShadow: "0 0 0 2px #0047AB, 0 10px 15px -3px rgba(0, 71, 171, 0.2)",
                    borderColor: "#0047AB"
                }
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`group relative flex flex-col h-[320px] rounded-[2rem] bg-white transition-colors duration-300 overflow-hidden cursor-pointer border-2 ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
            onClick={handleSelection}
        >
            {/* Main Image Area */}
            <div className="h-full w-full relative overflow-hidden bg-gray-50">
                {/* Selection Checkbox - Always visible on mobile, hover on desktop */}
                <div className={`absolute top-3 left-3 md:top-4 md:left-4 z-40 transition-all duration-200 ${isSelected ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}>
                    <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shadow-sm ${isSelected
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white/80 md:bg-white/40 border-white/60 md:border-white/60 hover:bg-white text-transparent'
                            }`}
                    >
                        <Check size={14} strokeWidth={3} />
                    </div>
                </div>

                {asset.format === 'MP4' ? (
                    <video
                        src={asset.previewUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="asset-card-media"
                    />
                ) : (
                    <motion.img
                        variants={{
                            rest: { scale: 1, y: 0 },
                            hover: { scale: 1.1, y: 8 },
                            selected: { scale: 1, y: 0 }
                        }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        src={asset.previewUrl}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#00235E]/80 via-transparent to-transparent transition-opacity duration-500 z-10 ${isSelected ? 'opacity-80' : 'opacity-0 group-hover:opacity-100'}`} />

                {/* Sheen Effect (only on hover when not selected) */}
                {!isSelected && (
                    <motion.div
                        variants={{
                            rest: { x: '-100%', opacity: 0 },
                            hover: { x: '200%', opacity: 0.3 }
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 z-20 pointer-events-none"
                    />
                )}

                {/* Hover Actions - Visible on mobile default, hover on desktop */}
                <div className={`absolute top-3 right-3 md:top-4 md:right-4 flex gap-2 transition-all duration-300 translate-y-0 md:translate-y-2 z-30 ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'}`}>
                    <button className="p-2 md:p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-colors border border-white/20 shadow-lg active:scale-95">
                        <Heart size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>
                    <button className="p-2 md:p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-colors border border-white/20 shadow-lg active:scale-95">
                        <Share2 size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-30">
                    <div className={`p-3 md:p-4 rounded-[1.25rem] md:rounded-3xl backdrop-blur-xl border flex items-center justify-between transform transition-all duration-300 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 ${isSelected
                        ? 'bg-primary/90 border-primary/50 text-white translate-y-0'
                        : 'bg-white/90 border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)]'
                        }`}>
                        <div className="flex flex-col">
                            <h3 className={`font-bold text-sm leading-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>{asset.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {/* Format Badges */}
                                <div className="flex gap-1">
                                    {asset.availableFormats?.map(fmt => (
                                        <span key={fmt} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${isSelected
                                            ? 'border-white/40 text-white bg-white/10'
                                            : 'border-gray-200 text-gray-500 bg-gray-50'
                                            }`}>
                                            {fmt}
                                        </span>
                                    )) || (
                                            <span className={`text-[10px] font-medium ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>{asset.format}</span>
                                        )}
                                </div>

                                {/* Separator */}
                                <span className={`text-[10px] ${isSelected ? 'text-white/60' : 'text-gray-300'}`}>|</span>

                                {/* Variant Tag (Use the second tag usually, e.g. "1 TINTA") */}
                                {asset.tags && asset.tags.length > 1 && (
                                    <span className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${isSelected
                                        ? 'text-white bg-primary-600'
                                        : 'text-primary bg-primary/5'
                                        }`}>
                                        {asset.tags[1]}
                                    </span>
                                )}
                            </div>
                        </div>

                        <motion.div className="flex gap-2">
                            {asset.localPaths?.svg && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        downloadSingleAsset({ ...asset, downloadUrl: asset.localPaths?.svg, format: 'SVG' });
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all ${isSelected
                                        ? 'bg-white text-primary hover:bg-white/90'
                                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                        }`}
                                >
                                    <Download size={12} />
                                    SVG
                                </button>
                            )}
                            {asset.localPaths?.png && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        downloadSingleAsset({ ...asset, downloadUrl: asset.localPaths?.png, format: 'PNG' });
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all ${isSelected
                                        ? 'bg-white text-primary hover:bg-white/90'
                                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                        }`}
                                >
                                    <Download size={12} />
                                    PNG
                                </button>
                            )}
                            {!asset.localPaths?.svg && !asset.localPaths?.png && (
                                <motion.button
                                    onClick={handleDownload}
                                    layout
                                    whileTap={{ scale: 0.9 }}
                                    animate={isDownloading ? {
                                        backgroundColor: "#10B981",
                                        color: "#FFFFFF",
                                        scale: 1.1
                                    } : {
                                        backgroundColor: isSelected ? "#FFFFFF" : "rgba(0, 71, 171, 0.1)",
                                        color: isSelected ? "#0047AB" : "#0047AB"
                                    }}
                                    className={`p-2 rounded-full flex items-center justify-center relative ${!isDownloading && !isSelected ? 'hover:bg-primary hover:text-white' : ''
                                        } ${!isDownloading && isSelected ? 'hover:bg-white/90' : ''}`}
                                >
                                    <Download size={18} />
                                </motion.button>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AssetCard;