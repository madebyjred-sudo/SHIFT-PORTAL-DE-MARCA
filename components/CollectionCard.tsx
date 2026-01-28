import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Collection } from '../types';
import { Play, ArrowRight } from 'lucide-react';

interface CollectionCardProps {
    collection: Collection;
    onClick: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onClick }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
            setIsPlaying(true);
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative w-full h-[280px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-900"
        >
            {/* Background Media */}
            <div className="absolute inset-0 w-full h-full">
                {collection.coverVideoUrl ? (
                    <video
                        src={collection.coverVideoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="asset-card-media opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0e1745] to-[#1534dc]" />
                )}
            </div>

            {/* Overlay Gradient (Always visible for readability) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                <div className="flex justify-between items-end">
                    <div>
                        <motion.div
                            className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-3 border border-white/20"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <span className="text-[10px] font-bold tracking-widest text-white uppercase">Colección</span>
                        </motion.div>
                        <h3 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-primary-foreground transition-colors">
                            {collection.title}
                        </h3>
                        <p className="text-gray-300 text-sm font-medium">
                            {collection.itemCount} Recursos
                        </p>
                    </div>

                    {/* Action Icon */}
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                        <ArrowRight size={20} className="text-white group-hover:text-black transition-colors" />
                    </div>
                </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none z-30" />
        </motion.div>
    );
};

export default CollectionCard;
