import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import AssetCard from './AssetCard';
import GuidelinesView from './GuidelinesView';
import TemplatesView from './TemplatesView';
import ManifestoView from './ManifestoView';
import { Asset, ViewType } from '../types';
import { Bell, Filter, ChevronDown, Plus, Download, X, Cloud, HardDrive, Loader2 } from 'lucide-react';
import { MOCK_ASSETS } from '../constants';
import { localAssets, localCollections } from '../src/data/localAssets';
import CollectionCard from './CollectionCard';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadBatchAssets } from '../services/downloadService';
import { useMsal, useAccount } from "@azure/msal-react";
import { loginRequest, isSimulationMode } from '../authConfig';
import { getOneDriveAssets, initializeGraphClient } from '../services/graphService';

interface AssetsDashboardProps {
    currentView: ViewType;
    onNavigate: (view: ViewType, params?: any) => void;
    onOpenChat: () => void;
    params?: {
        category?: string;
        assetId?: string;
        scrollTo?: string;
    };
}

type DataSource = 'local' | 'onedrive';

const AssetsDashboard: React.FC<AssetsDashboardProps> = ({ currentView, onNavigate, onOpenChat, params }) => {
    const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

    // Effect to handle params
    useEffect(() => {
        if (params?.category) {
            setSelectedCollection(params.category);
        }
        // Could handle assetId or scrolling here too
    }, [params]);

    // MSAL Hooks
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});

    // OneDrive Integration State
    const [oneDriveAssets, setOneDriveAssets] = useState<Asset[]>([]);
    const [isLoadingCloud, setIsLoadingCloud] = useState(false);

    // Auto-fetch logic: If logged in, fetch cloud. If not, use mocks.
    // We treat "account exists" as the "OneDrive" source equivalent.
    const showCloudAssets = !!account || isSimulationMode();

    // Fetch OneDrive Assets when source changes
    useEffect(() => {
        if (showCloudAssets && oneDriveAssets.length === 0) {
            const fetchCloudAssets = async () => {
                setIsLoadingCloud(true);
                try {
                    // 1. Get Token if not in simulation
                    if (!isSimulationMode() && account) {
                        const response = await instance.acquireTokenSilent({
                            ...loginRequest,
                            account: account
                        });
                        initializeGraphClient(response.accessToken);
                    }

                    // 2. Fetch
                    const assets = await getOneDriveAssets();
                    setOneDriveAssets(assets);
                } catch (error) {
                    console.error("Failed to load OneDrive assets", error);
                } finally {
                    setIsLoadingCloud(false);
                }
            };
            fetchCloudAssets();
        }
    }, [showCloudAssets, oneDriveAssets.length, account, instance]);

    const toggleAssetSelection = (id: string) => {
        const newSelection = new Set(selectedAssets);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedAssets(newSelection);
    };

    const clearSelection = () => {
        setSelectedAssets(new Set());
    };

    const handleBatchDownload = async () => {
        // Auth Check
        if (!account && !isSimulationMode()) {
            try {
                await instance.loginPopup(loginRequest);
                return;
            } catch (error) {
                console.error("Login failed", error);
                return;
            }
        }

        const assets = showCloudAssets ? oneDriveAssets : MOCK_ASSETS;
        const assetsToDownload = assets.filter(a => selectedAssets.has(a.id));
        await downloadBatchAssets(assetsToDownload as Asset[]);
    };

    // Helper to render the main content based on view
    const renderContent = () => {
        switch (currentView) {
            case 'guidelines':
                return <GuidelinesView />;
            case 'templates':
                return <TemplatesView />;
            case 'manifesto':
                return <ManifestoView onNavigate={onNavigate} />;
            case 'assets':
            default:
                // Combine Local Assets with Mock Assets (excluding mock logos if we have real ones, or just show all)
                // Prioritize Local Assets
                const defaultAssets = [...localAssets, ...MOCK_ASSETS];
                let displayAssets = showCloudAssets ? oneDriveAssets : defaultAssets;

                // Apply Collection Filter
                if (selectedCollection) {
                    displayAssets = displayAssets.filter(asset =>
                        asset.category === selectedCollection ||
                        asset.tags?.includes(selectedCollection)
                    );
                }

                return (
                    <>
                        {/* Collections Grid - Show only when not filtering or searching (simplified) */}
                        {!selectedCollection && !isLoadingCloud && localCollections.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900">Colecciones</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {localCollections.map(collection => (
                                        <CollectionCard
                                            key={collection.id}
                                            collection={collection}
                                            onClick={() => setSelectedCollection(collection.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Content Controls */}
                        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 gap-6 px-2">
                            {/* Filters (Source Toggle Removed) */}
                            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
                                {selectedCollection && (
                                    <button
                                        onClick={() => setSelectedCollection(null)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-bold shadow-md hover:scale-105 transition-all"
                                    >
                                        <X size={16} />
                                        {selectedCollection}
                                    </button>
                                )}

                                <div className="flex gap-2 min-w-max">
                                    {['Todos', 'Logos', 'Íconos', 'Tipografía', 'Fotografía'].map((filter, i) => (
                                        <button
                                            key={filter}
                                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${i === 0
                                                ? 'bg-white border-transparent shadow-md text-primary'
                                                : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3 min-w-max ml-auto">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors shadow-sm">
                                        <Filter size={16} />
                                        Filtros
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors shadow-sm">
                                        Ordenar por
                                        <ChevronDown size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loading State for Cloud */}
                        {isLoadingCloud ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Loader2 size={40} className="animate-spin mb-4 text-[#0078D4]" />
                                <p className="font-medium animate-pulse">Sincronizando con OneDrive...</p>
                            </div>
                        ) : (
                            <>
                                {/* Asset Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                    {displayAssets.length > 0 ? (
                                        displayAssets.map((asset) => (
                                            <AssetCard
                                                key={asset.id}
                                                asset={asset as Asset}
                                                isSelected={selectedAssets.has(asset.id)}
                                                onToggleSelection={toggleAssetSelection}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center text-gray-400">
                                            <Cloud size={48} className="mx-auto mb-4 opacity-20" />
                                            <p className="text-lg">No se encontraron items.</p>
                                            {!account && (
                                                <p className="mt-2 text-sm text-gray-500">
                                                    ¿No encontrás lo que ocupás? Probá <button onClick={() => instance.loginPopup(loginRequest)} className="text-primary font-bold hover:underline">iniciando sesión</button> para ver más recursos.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div >

                                {/* Footer Nudge for Logout Users */}
                                {
                                    !account && displayAssets.length > 0 && (
                                        <div className="text-center py-8 border-t border-gray-100 mb-20">
                                            <p className="text-gray-500 text-sm">
                                                ¿No encontrás lo que ocupás? <button onClick={() => instance.loginPopup(loginRequest)} className="text-primary font-bold hover:underline">Iniciá sesión</button> para acceder a la biblioteca completa en la nube.
                                            </p>
                                        </div>
                                    )
                                }
                            </>
                        )}
                    </>
                );
        }
    };

    const getPageTitle = () => {
        switch (currentView) {
            case 'guidelines': return { title: 'Guías de Marca', subtitle: 'Documentación oficial de identidad' };
            case 'templates': return { title: 'Centro de Plantillas', subtitle: 'Recursos listos para usar' };
            default: return { title: 'Assets de Marca', subtitle: 'Gestioná y descargá recursos oficiales' };
        }
    };

    const headerInfo = getPageTitle();

    return (
        <div className="flex min-h-screen bg-[#F0F2F5]">
            <Sidebar currentView={currentView} onNavigate={onNavigate} onOpenChat={onOpenChat} />

            <motion.main
                // Reset scroll when changing views
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex-1 p-4 lg:p-6 overflow-x-hidden relative"
            >
                {/* Glass Header for Dashboard - Shared across views */}
                <header className="flex items-center justify-between mb-6 lg:mb-8 px-2 pt-2 lg:pr-20">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-tertiary">{headerInfo.title}</h1>
                        <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">{headerInfo.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-4">
                        <a
                            href="https://teams.microsoft.com/l/channel/19%3ADhG42dauuHnpdN2TFZ5rrfQB0DTWGQFcK4c3zRoAYAI1%40thread.tacv2/Updates?groupId=198602e1-483c-4d59-862f-70cf1c8f7978&tenantId=6220c548-8b15-4258-ba64-21d1abe8e727"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 lg:p-3 rounded-full bg-white/50 hover:bg-white transition-colors text-gray-600 shadow-sm active:scale-95"
                            title="Ver actualizaciones en Teams"
                        >
                            <Bell size={18} className="lg:w-5 lg:h-5" />
                        </a>
                        {currentView === 'assets' && (
                            <button
                                onClick={() => window.location.href = "mailto:juan.rojas@shiftpn.co.cr?subject=Solicitud de assets"}
                                className="hidden sm:flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 bg-primary text-white rounded-full font-medium shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all text-sm lg:text-base"
                            >
                                <Plus size={16} className="lg:w-[18px] lg:h-[18px]" />
                                <span>Solicitar</span>
                            </button>
                        )}
                    </div>
                </header>

                {/* Render Dynamic Content */}
                {renderContent()}

                {/* Batch Selection FAB - Only relevant for assets view */}
                <AnimatePresence>
                    {currentView === 'assets' && selectedAssets.size > 0 && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 p-2 pl-6 pr-2 bg-tertiary text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/10"
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{selectedAssets.size}</span>
                                <span className="text-sm font-medium text-white/70">seleccionados</span>
                            </div>

                            <div className="h-6 w-px bg-white/20 mx-2" />

                            <button
                                onClick={handleBatchDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-tertiary rounded-full font-bold text-sm hover:bg-gray-100 transition-colors"
                            >
                                <Download size={16} />
                                Descargar ZIP
                            </button>

                            <button
                                onClick={clearSelection}
                                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.main>
        </div>
    );
};

export default AssetsDashboard;