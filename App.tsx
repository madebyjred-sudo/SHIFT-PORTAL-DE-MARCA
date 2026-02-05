import React, { useState } from 'react';
import ChatBot from './components/ChatBot';
import HomeHub from './components/HomeHub';
import AssetsDashboard from './components/AssetsDashboard';
import MobileNav from './components/MobileNav';
import { ViewType } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import MouseGradient from './components/MouseGradient';

import { SearchProvider } from './context/SearchContext';

const App: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<{ view: ViewType; params?: any }>({ view: 'home' });
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleNavigate = (view: ViewType, params?: any) => {
    setActiveRoute({ view, params });
  };

  const currentView = activeRoute.view;

  return (
    <SearchProvider>
      <div className="min-h-screen bg-soft-gradient font-sans text-on-surface selection:bg-secondary/30 selection:text-white">
        <MouseGradient />
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div
              key="home"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HomeHub
                onNavigate={handleNavigate}
                onOpenChat={() => setIsChatOpen(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="assets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="pb-24 lg:pb-0"
            >
              <AssetsDashboard
                currentView={currentView}
                onNavigate={handleNavigate}
                onOpenChat={() => setIsChatOpen(true)}
                params={activeRoute.params}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Navigation - Visible on mobile */}
        {currentView !== 'home' && (
          <MobileNav
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        <ChatBot
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
          showTrigger={currentView !== 'home'}
          currentView={currentView}
          onNavigate={handleNavigate}
        />
      </div>
    </SearchProvider>
  );
};

export default App;