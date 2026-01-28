import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Menu } from 'lucide-react';
import Button from './Button';

const TopAppBar: React.FC = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 10);
    });
  }, [scrollY]);

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        isScrolled ? 'bg-surface/90 backdrop-blur-md shadow-elevation-2' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
            <div className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-primary' : 'text-white'}`}>
                Shift
            </div>
            <div className={`w-2 h-2 rounded-full ${isScrolled ? 'bg-secondary' : 'bg-secondary'}`} />
        </div>

        {/* Desktop Nav */}
        <nav className={`hidden md:flex gap-8 ${isScrolled ? 'text-on-surface' : 'text-white/90'}`}>
          {['Brand Assets', 'Templates', 'Guidelines', 'Showcase'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium hover:opacity-70 transition-opacity">
              {item}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
            <Button variant="text" size="small" className={!isScrolled ? 'text-white hover:bg-white/10' : ''}>
                <Search size={20} />
            </Button>
            <div className="md:hidden">
                <Button variant="text" size="small" className={!isScrolled ? 'text-white hover:bg-white/10' : ''}>
                    <Menu size={20} />
                </Button>
            </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopAppBar;