import { useEffect, useState, useMemo, memo } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HashRegistry } from './components/HashRegistry';
import { StampRegistry } from './components/StampRegistry';
import { TagRegistry } from './components/TagRegistry';
import { Roadmap } from './components/Roadmap';
import { Footer } from './components/Footer';
import { MeshGradient } from './components/MeshGradient';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ui/Toast';
import { updateFavicon } from './utils/favicon';
import { useWallet } from './context/WalletContext';
import { useSearch, type SearchableItem } from './hooks/useSearch';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from './components/ui/Button';
import { PullToRefresh } from './components/ui/PullToRefresh';
import { EmptyState } from './components/ui/EmptyState';
import { LogicErrorBoundary } from './components/ui/LogicErrorBoundary';
import { PerformanceOverlay } from './components/ui/PerformanceOverlay';
import { QuickActions } from './components/ui/QuickActions';
import './App.css';

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

const RegistryItem = memo(({ component, index }: { component: React.ReactNode, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="registry-wrapper"
  >
    {component}
  </motion.div>
));

interface Registry extends SearchableItem {
  render: (query: string) => React.ReactNode;
}

const App = () => {
  const { isConnected, isConnecting } = useWallet();
  const [lastUpdated] = useState(new Date().toLocaleTimeString());

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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.search-input')?.focus();
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
                aria-label="Registry filtering and search tools"
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
                      onClick={() => setSearchQuery('')}
                      className="search-clear"
                      aria-label="Clear registry search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="search-meta" id="search-metadata" role="status" aria-live="polite">
                  <div className="flex flex-col gap-1">
                    <span className="sr-only">Search results updated: </span>
                    <span>
                      Showing {filteredItems.length} of {INITIAL_REGISTRIES.length} registries
                    </span>
                    <span className="text-[10px] opacity-70 animate-pulse-slow">
                      Last synchronized: {lastUpdated}
                    </span>
                  </div>
                  {(searchQuery || selectedCategories.length > 0) && (
                    <button
                      type="button"
                      className="search-meta-reset"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategories([]);
                      }}
                      aria-controls="registry-results"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
                <div className="search-suggestions" role="group" aria-label="Search suggestions">
                  {['Hash', 'Stamp', 'Tag'].map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => toggleCategory(suggestion)}
                      className={twMerge(
                        "search-chip",
                        selectedCategories.includes(suggestion) && "search-chip-active"
                      )}
                      aria-pressed={selectedCategories.includes(suggestion)}
                      aria-controls="registry-results"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
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
