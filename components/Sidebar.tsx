import React, { useEffect, useState } from 'react';
import { Home, Layers, LayoutTemplate, Type, Settings, User, LogOut, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewType } from '../types';
import BrandLogo from './BrandLogo';
import { useMsal, useAccount } from "@azure/msal-react";
import { loginRequest, isSimulationMode } from '../authConfig';
import { initializeGraphClient, getUserProfilePhoto } from '../services/graphService';
import { useSearch } from '../context/SearchContext';
import SearchResults from './SearchResults';

interface SidebarProps {
    currentView: ViewType;
    onNavigate: (view: ViewType) => void;
    onOpenChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onOpenChat }) => {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const { query, setQuery } = useSearch();

    const handleLogin = () => {
        if (isSimulationMode()) {
            alert("Modo Simulación: Para habilitar el inicio de sesión real, configurá las credenciales de Azure en tu archivo .env.local y reiniciá el servidor.");
            return;
        }

        instance.loginPopup(loginRequest).catch(e => {
            console.error(e);
        });
    };

    const handleLogout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
    };

    useEffect(() => {
        if (account && !isSimulationMode()) {
            instance.acquireTokenSilent({
                ...loginRequest,
                account: account
            }).then((response) => {
                initializeGraphClient(response.accessToken);
                getUserProfilePhoto().then(photo => setUserPhoto(photo));
            });
        }
    }, [account, instance]);
    const menuItems = [
        { icon: <Home size={20} />, label: 'Inicio', id: 'home' as ViewType },
        { icon: <Zap size={20} />, label: 'Manifiesto', id: 'manifesto' as ViewType },
        { icon: <Type size={20} />, label: 'Guías', id: 'guidelines' as ViewType },
        { icon: <Layers size={20} />, label: 'Todos los Assets', id: 'assets' as ViewType },
        { icon: <LayoutTemplate size={20} />, label: 'Plantillas', id: 'templates' as ViewType },
    ];

    return (
        <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden lg:flex flex-col w-[280px] h-[calc(100vh-2rem)] sticky top-4 rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.05)] ml-4 my-4 z-40 overflow-hidden"
        >
            {/* Header */}
            <div className="p-8 pb-4">
                <div className="mb-8 cursor-pointer" onClick={() => onNavigate('home')}>
                    <BrandLogo variant="color" isIso={true} />
                </div>

                <div className="relative z-50">
                    <input
                        type="text"
                        value={query || ''}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar assets..."
                        className="w-full bg-white/50 border border-white/40 rounded-2xl py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/80 transition-all placeholder:text-gray-400"
                    />
                    <svg className="absolute left-3.5 top-3.5 text-gray-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <SearchResults onNavigate={onNavigate} />
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
                <div className="text-xs font-bold text-gray-400 px-4 mb-2 uppercase tracking-wider">Biblioteca</div>
                {menuItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-white shadow-sm text-primary'
                                : 'text-gray-600 hover:bg-white/30 hover:text-primary'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active-indicator"
                                    className="absolute left-0 inset-y-3.5 w-1 bg-primary rounded-r-full shadow-[0_0_12px_rgba(0,71,171,0.5)] z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    );
                })}

                <div className="mt-8 text-xs font-bold text-gray-400 px-4 mb-2 uppercase tracking-wider">Herramientas</div>

                {/* Shifty Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenChat}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg shadow-secondary/20 relative overflow-hidden group mb-2"
                >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF00FF] to-[#0047AB] opacity-90 group-hover:opacity-100 transition-opacity" />

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-3">
                        <img src="/shift-reduced.svg" alt="Shifty" className="h-5 w-auto brightness-0 invert" />
                        <span>Asistente Shifty</span>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
                </motion.button>

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:bg-white/30 hover:text-primary transition-all">
                    <Settings size={20} />
                    Preferencias
                </button>
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 mt-auto">
                {account ? (
                    <div className="p-3 rounded-2xl bg-white/40 border border-white/40 flex items-center gap-3 cursor-pointer hover:bg-white/60 transition-colors group relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-white flex items-center justify-center border border-white overflow-hidden relative">
                            {userPhoto ? (
                                <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} className="text-gray-500" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-gray-800 truncate">{account.name}</div>
                            <div className="text-xs text-gray-500 truncate">{account.username}</div>
                        </div>

                        {/* Logout Button (appears on hover) */}
                        <button
                            onClick={handleLogout}
                            className="absolute right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all text-red-500 hover:text-red-600"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        <User size={18} />
                        Iniciar Sesión
                    </button>
                )}
            </div>
        </motion.aside>
    );
};

export default Sidebar;