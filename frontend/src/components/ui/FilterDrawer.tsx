import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

/** Spring damping coefficient for the filter drawer slide animation. */
const DRAWER_SPRING_DAMPING = 25;
/** Spring stiffness coefficient for the filter drawer slide animation. */
const DRAWER_SPRING_STIFFNESS = 200;

interface FilterDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode;
  activeFiltersCount: number;
}

export const FilterDrawer = ({ isOpen, onOpen, onClose, children, activeFiltersCount }: FilterDrawerProps) => {
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={onOpen}
        className={twMerge(
          "md:hidden fixed bottom-24 right-6 z-[100] h-14 w-14 rounded-full bg-primary text-white shadow-2xl flex-center transition-all",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
        aria-label="Open filters"
      >
        <div className="relative">
          <Filter size={24} />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary border-2 border-primary">
              {activeFiltersCount}
            </span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: DRAWER_SPRING_DAMPING, stiffness: DRAWER_SPRING_STIFFNESS }}
              className="fixed bottom-0 left-0 right-0 bg-background border-t border-white/10 rounded-t-[32px] p-8 z-[1001] md:hidden max-h-[80vh] overflow-y-auto"
            >
              <div className="flex-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {activeFiltersCount} active
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
