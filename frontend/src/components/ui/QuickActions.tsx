import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Hash, Stamp, Tag as TagIcon, ArrowUp, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';
import { Tooltip } from './Tooltip';
import { triggerHaptic } from '../../utils/haptics';

const FAB_ACTIONS = [
    { id: 'hash', icon: Hash, label: 'Hash Registry', color: 'bg-primary' },
    { id: 'stamp', icon: Stamp, label: 'Stamp Registry', color: 'bg-primary' },
    { id: 'tag', icon: TagIcon, label: 'Tag Registry', color: 'bg-primary' },
];

/** Number of pixels scrolled before the FAB becomes visible. */
const FAB_SCROLL_THRESHOLD = 400;

/**
 * QuickActions component providing a floating action button (FAB) for rapid access
 * to primary registry functions and navigation.
 * Features:
 * - Scroll-triggered visibility
 * - Animated action expansion
 * - Haptic feedback integration
 * - Keyboard accessibility
 */
export const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show FAB after FAB_SCROLL_THRESHOLD px of scrolling
      setIsVisible(window.scrollY > FAB_SCROLL_THRESHOLD);
      if (window.scrollY <= FAB_SCROLL_THRESHOLD && isOpen) setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const handleAction = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Focus the first input in the card
      setTimeout(() => {
        element.querySelector('input, textarea')?.focus();
      }, 500);
    }
    setIsOpen(false);
    triggerHaptic('light');
  };

  return (
    <div className={twMerge(
      "fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3 transition-all duration-500",
      !isVisible && "opacity-0 translate-y-16 pointer-events-none"
    )}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="quick-actions-panel"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="flex flex-col items-end gap-4 mb-4"
          >
            {FAB_ACTIONS.map((action, index) => (
              <motion.div 
                key={action.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 group"
              >
                <span className="px-3 py-1.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  {action.label}
                </span>
                <Tooltip content={action.label}>
                  <button
                    type="button"
                    onClick={() => handleAction(action.id)}
                    className="h-12 w-12 rounded-2xl bg-primary text-white shadow-2xl flex-center hover:scale-110 active:scale-95 transition-all relative overflow-hidden group/btn"
                    aria-label={`Go to ${action.label}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    <action.icon size={20} />
                  </button>
                </Tooltip>
              </motion.div>
            ))}
            
            <div className="w-8 h-[1px] bg-white/10 my-1 mr-2" />
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tooltip content="Back to Top">
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsOpen(false);
                    triggerHaptic('medium');
                  }}
                  className="h-12 w-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white/50 hover:text-white flex-center hover:bg-white/10 transition-all"
                  aria-label="Scroll to top"
                >
                  <ArrowUp size={20} />
                </button>
              </Tooltip>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          triggerHaptic('medium');
        }}
        className={twMerge(
          "h-14 w-14 md:h-16 md:w-16 rounded-[24px] shadow-2xl flex-center transition-all duration-500",
          isOpen 
            ? "bg-white text-black rotate-90" 
            : "bg-primary text-white hover:scale-105 active:scale-95"
        )}
        aria-label={isOpen ? "Close actions menu" : "Open quick actions"}
        aria-expanded={isOpen}
        aria-controls="quick-actions-panel"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
            >
              <Plus size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};
