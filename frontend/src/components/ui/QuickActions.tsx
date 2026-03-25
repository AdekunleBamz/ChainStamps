import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Hash, Stamp, Tag, ArrowUp, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';
import { Tooltip } from './Tooltip';
import { triggerHaptic } from '../../utils/haptics';

export const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const actions = [
    { id: 'hash', icon: Hash, label: 'New Hash', color: 'bg-primary' },
    { id: 'stamp', icon: Stamp, label: 'New Stamp', color: 'bg-primary' },
    { id: 'tag', icon: Tag, label: 'New Tag', color: 'bg-primary' },
  ];

  const handleAction = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.focus();
    }
    setIsOpen(false);
    triggerHaptic('light');
  };

  return (
    <div className={twMerge(
      "fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 transition-all duration-300",
      !isVisible && "opacity-0 translate-y-10 pointer-events-none"
    )}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="flex flex-col items-end gap-3 mb-2"
          >
            {actions.map((action) => (
              <div key={action.id} className="flex items-center gap-3 group">
                <span className="px-2 py-1 bg-background/80 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.label}
                </span>
                <Tooltip content={action.label}>
                  <Button
                    variant="primary"
                    size="icon"
                    className="h-10 w-10 rounded-full shadow-xl"
                    onClick={() => handleAction(action.id)}
                  >
                    <action.icon size={18} />
                  </Button>
                </Tooltip>
              </div>
            ))}
            <div className="h-px w-8 bg-white/10 my-1 mr-1" />
            <Tooltip content="Back to Top">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-md shadow-xl"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsOpen(false);
                  triggerHaptic('medium');
                }}
              >
                <ArrowUp size={18} />
              </Button>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="primary"
        size="icon"
        className={twMerge(
          "h-14 w-14 rounded-full shadow-2xl transition-transform duration-300",
          isOpen ? "rotate-45 bg-destructive hover:bg-destructive/90" : ""
        )}
        onClick={() => {
          setIsOpen(!isOpen);
          triggerHaptic('medium');
        }}
        aria-label="Quick actions menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </Button>
    </div>
  );
};
