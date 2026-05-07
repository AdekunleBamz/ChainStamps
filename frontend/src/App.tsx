import { useEffect, useState, useMemo, memo, Suspense, lazy } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';

// Lazy load registries for performance
const HashRegistry = lazy(() => import('./components/HashRegistry').then(module => ({ default: module.HashRegistry })));
const StampRegistry = lazy(() => import('./components/StampRegistry').then(module => ({ default: module.StampRegistry })));
const TagRegistry = lazy(() => import('./components/TagRegistry').then(module => ({ default: module.TagRegistry })));
import { Roadmap } from './components/Roadmap';
import { Footer } from './components/Footer';
import { MeshGradient } from './components/MeshGradient';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ui/Toast';
import { updateFavicon } from './utils/favicon';
import { useWallet } from './context/WalletContext';
import { useSearch, type SearchableItem } from './hooks/useSearch';
import { Search, X, Loader2, Filter } from 'lucide-react';
import { Button } from './components/ui/Button';
import { PullToRefresh } from './components/ui/PullToRefresh';
import { EmptyState } from './components/ui/EmptyState';
import { LogicErrorBoundary } from './components/ui/LogicErrorBoundary';
import { PerformanceOverlay } from './components/ui/PerformanceOverlay';
import { QuickActions } from './components/ui/QuickActions';
import { FilterDrawer } from './components/ui/FilterDrawer';
import { triggerHaptic } from './utils/haptics';
import './App.css';

/** Suggested search tags shown in the search bar and filter drawer. */
const SUGGESTED_SEARCH_TAGS = ['SHA-256', 'Immutable', 'Identity', 'Security'];

/** Registry category options shown in the filter drawer. */
const REGISTRY_CATEGORIES = ['Hash', 'Stamp', 'Tag'];

/**
 * A purely logic component that updates the site's favicon based on wallet connection status.
 */
const FaviconManager = () => {
  const { isConnected, isConnecting } = useWallet();

  useEffect(() => {
    const status = isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected';
    updateFavicon(status);
  }, [isConnected, isConnecting]);

  return null;
}

/** Animation stagger delay multiplier for registry items (seconds per index step). */
const REGISTRY_STAGGER_DELAY = 0.1;
/** Minimum skeleton height for lazy-loaded registry cards. */
const REGISTRY_SKELETON_HEIGHT = 400;

const RegistryItem = memo(({ component, index }: { component: React.ReactNode, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * REGISTRY_STAGGER_DELAY }}
    className="registry-wrapper"
  >
    <Suspense fallback={
      <div className={`h-[${REGISTRY_SKELETON_HEIGHT}px] w-full bg-white/5 animate-pulse rounded-3xl border border-white/10 flex items-center justify-center`}>
        <Loader2 className="spinning text-primary/20" size={32} />
      </div>
    }>
      {component}
    </Suspense>
  </motion.div>
));

interface Registry extends SearchableItem {
  render: (query: string) => React.ReactNode;
}

const App = () => {
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const INITIAL_REGISTRIES: Registry[] = useMemo(() => [
    { 
      id: 'hash', 
      name: 'Hash Registry', 
      category: 'Hash',
      description: 'Store and verify SHA-256 hashes for files and data',
      tags: ['security', 'verification', 'hashes'],
      render: (query) => <HashRegistry searchQuery={query} /> 
    },
    { 
      id: 'stamp', 
      name: 'Stamp Registry', 
      category: 'Stamp',
      description: 'Permanent on-chain text stamps and messages',
      tags: ['timestamp', 'content', 'identity'],
      render: (query) => <StampRegistry searchQuery={query} /> 
    },
    { 
      id: 'tag', 
      name: 'Tag Registry', 
      category: 'Tag',
      description: 'Key-value metadata storage for on-chain identity',
      tags: ['metadata', 'tags', 'identity'],
      render: (query) => <TagRegistry searchQuery={query} /> 
    },
  ], []);

  const { searchQuery, setSearchQuery, selectedCategories, setSelectedCategories, toggleCategory, filteredItems, isStale } = useSearch<Registry>(INITIAL_REGISTRIES);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Search shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.search-input')?.focus();
      }
      
      // Registry navigation shortcuts (Alt + 1/2/3)
      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          document.getElementById('hash')?.scrollIntoView({ behavior: 'smooth' });
          triggerHaptic('light');
        }
        if (e.key === '2') {
          e.preventDefault();
          document.getElementById('stamp')?.scrollIntoView({ behavior: 'smooth' });
          triggerHaptic('light');
        }
        if (e.key === '3') {
          e.preventDefault();
          document.getElementById('tag')?.scrollIntoView({ behavior: 'smooth' });
          triggerHaptic('light');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ToastProvider>
      <WalletProvider>
        <FaviconManager />
        <div id="top" className="app">
          <LogicErrorBoundary>
            <a href="#main-content" className="skip-to-content focus:top-0 fixed -top-20 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 z-[1000] rounded-b-xl font-bold transition-all">
              Skip to content
            </a>
            <PullToRefresh onRefresh={async () => {
              window.location.reload();
            }} />
            <MeshGradient />
            <ToastContainer />
            <Header />
            <main id="main-content" className="main" tabIndex={-1} aria-label="Main Application Content">
              <h1 className="sr-only">ChainStamps: Secure and Permanent On-Chain Document Verification on Bitcoin via Stacks</h1>
              <Hero />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="filter-container"
                aria-label="Registry filtering and search tools" title="Search and filter registries"
              >
                <div className={twMerge(
                  "search-wrapper",
                  isStale && "opacity-50 grayscale transition-opacity"
                )} role="search">
                  {isStale ? (
                    <Loader2 className="search-icon spinning text-primary" size={18} />
                  ) : (
                    <Search className="search-icon" size={18} />
                  )}
                  <input
                    type="text"
                    placeholder="Search registries (Cmd+K)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        setSearchQuery('');
                        (event.target as HTMLInputElement).blur();
                      }
                    }}
                    className="search-input"
                    aria-label="Search registry cards"
                    aria-controls="registry-results"
                    aria-keyshortcuts="Esc, Cmd+K"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        triggerHaptic('light');
                      }}
                      className="search-clear"
                      aria-label="Clear registry search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="search-meta" id="search-metadata" role="status" aria-live="polite">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="sr-only">Search results updated: </span>
                      <span>
                        Showing {filteredItems.length} of {INITIAL_REGISTRIES.length} registries
                      </span>
                      {(searchQuery || selectedCategories.length > 0) && (
                        <span className="flex items-center justify-center bg-primary/20 text-primary text-[10px] font-bold h-4 px-1.5 rounded-full animate-in fade-in zoom-in">
                          { (searchQuery ? 1 : 0) + selectedCategories.length} filter{(searchQuery ? 1 : 0) + selectedCategories.length > 1 ? 's' : ''} active
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-70 animate-pulse-slow">
                      Last synchronized: {lastUpdated}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsFilterDrawerOpen(true)}
                      className="md:hidden flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
                    >
                      <Filter size={14} />
                      Filters
                    </button>
                    {(searchQuery || selectedCategories.length > 0) && (
                      <button
                        type="button"
                        className="search-meta-reset hover:text-primary transition-colors flex items-center gap-1 group"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategories([]);
                          triggerHaptic('medium');
                        }}
                        aria-controls="registry-results"
                      >
                        <X size={10} className="group-hover:rotate-90 transition-transform" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="search-suggestions" role="group" aria-label="Search suggestions">
                    <div className="flex items-center gap-2 mr-2">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Categories:</span>
                    </div>
                    <AnimatePresence mode="popLayout">
                      {REGISTRY_CATEGORIES.map(suggestion => {
                        const isSelected = selectedCategories.includes(suggestion);
                        return (
                          <motion.button
                            key={suggestion}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => {
                              toggleCategory(suggestion);
                              triggerHaptic('light');
                            }}
                            className={twMerge(
                              "search-chip",
                              isSelected && "search-chip-active"
                            )}
                            aria-pressed={isSelected}
                            aria-controls="registry-results"
                          >
                            {suggestion}
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                  <div className="search-suggestions mt-2" role="group" aria-label="Suggested searches">
                    <div className="flex items-center gap-2 mr-2">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Suggested:</span>
                    </div>
                    {SUGGESTED_SEARCH_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag);
                          triggerHaptic('light');
                        }}
                        className="text-[10px] text-primary/60 hover:text-primary transition-colors border border-primary/10 px-2 py-0.5 rounded-full hover:bg-primary/5"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Filter Drawer */}
                <FilterDrawer
                  isOpen={isFilterDrawerOpen}
                  onClose={() => setIsFilterDrawerOpen(false)}
                  activeFiltersCount={(searchQuery ? 1 : 0) + selectedCategories.length}
                >
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {REGISTRY_CATEGORIES.map(suggestion => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => toggleCategory(suggestion)}
                            className={twMerge(
                              "search-chip",
                              selectedCategories.includes(suggestion) && "search-chip-active"
                            )}
                            aria-pressed={selectedCategories.includes(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">Suggested Searches</h4>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTED_SEARCH_TAGS.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setSearchQuery(tag);
                              setIsFilterDrawerOpen(false);
                            }}
                            className="text-xs text-primary/60 hover:text-primary border border-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/5 transition-all"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategories([]);
                        setIsFilterDrawerOpen(false);
                      }}
                      variant="outline"
                    >
                      Reset All Filters
                    </Button>
                  </div>
                </FilterDrawer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="cards-container"
                id="registry-results"
                role="region"
                aria-label="Filtered registry results"
              >
                {filteredItems.length > 0 ? (
                  filteredItems.map((reg, index) => (
                    <RegistryItem 
                      key={reg.id} 
                      component={reg.render(searchQuery)} 
                      index={index} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12">
                    <EmptyState
                      title="No registries found"
                      description={`We couldn't find any results matching "${searchQuery}". Try a different search term or clear the filter.`}
                      action={
                        <Button variant="outline" onClick={() => setSearchQuery('')}>
                          Clear Search
                        </Button>
                      }
                    />
                  </div>
                )}
              </motion.div>

              <Roadmap />
            </main>
            <Footer />
          </LogicErrorBoundary>
          <PerformanceOverlay />
          <QuickActions />
        </div>
      </WalletProvider>
    </ToastProvider>
  );
}

export default App;
