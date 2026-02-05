import React from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, FileText, Layout } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { ViewType } from '../types';

interface MobileNavProps {
    currentView: ViewType;
    onNavigate: (view: ViewType) => void;
    onOpenChat: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate, onOpenChat }) => {
    const navItems = [
        { icon: Home, label: 'Inicio', id: 'home' as ViewType },
        { icon: Layers, label: 'Assets', id: 'assets' as ViewType },
        { icon: FileText, label: 'Guías', id: 'guidelines' as ViewType },
        { icon: Layout, label: 'Plantillas', id: 'templates' as ViewType },
    ];

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
        >
            {/* Glassmorphism Background */}
            <div className="mx-3 mb-3 rounded-[1.75rem] bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] overflow-hidden">
                <div className="flex items-center justify-around py-2 px-1">
                    {navItems.map((item) => {
                        const isActive = currentView === item.id;
                        const Icon = item.icon;

                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[60px] group"
                                whileTap={{ scale: 0.9 }}
                            >
                                {/* Active Background Pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-active"
                                        className="absolute inset-0 mx-1 bg-primary/10 rounded-2xl"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}

                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                        y: isActive ? -2 : 0
                                    }}
                                    className="relative z-10"
                                >
                                    <Icon
                                        size={22}
                                        className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-400'
                                            }`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </motion.div>

                                <motion.span
                                    animate={{ opacity: isActive ? 1 : 0.6 }}
                                    className={`text-[10px] font-semibold mt-1 relative z-10 transition-colors ${isActive ? 'text-primary' : 'text-gray-500'
                                        }`}
                                >
                                    {item.label}
                                </motion.span>
                            </motion.button>
                        );
                    })}

                    {/* Shifty Button - Special Styled */}
                    <motion.button
                        onClick={onOpenChat}
                        className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[60px]"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <img src="/shift-reduced.svg" alt="Shifty" className="h-6 w-auto mb-0.5 brightness-0 invert" />
                        <span className="text-[10px] font-bold mt-1 text-secondary">
                            Shifty
                        </span>
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
};

export default MobileNav;
