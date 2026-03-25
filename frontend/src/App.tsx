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
import { Search, X } from 'lucide-react';
import { Button } from './components/ui/Button';
import { PullToRefresh } from './components/ui/PullToRefresh';
import { EmptyState } from './components/ui/EmptyState';
import { LogicErrorBoundary } from './components/ui/LogicErrorBoundary';
import { PerformanceOverlay } from './components/ui/PerformanceOverlay';
import './App.css';

/**
 * A purely logic component that updates the site's favicon based on wallet connection status.
 * 
 * @returns {null} Renders nothing to the DOM.
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

/**
 * Main Application component.
 * Acts as the root coordinator for the ChainStamp frontend, managing:
 * - Global layout structure (Hero, Search, Roadmap)
 * - Integration with Wallet and Toast providers
 * - Registry filtering and search logic
 * 
 * @component
 */
const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const registries = useMemo(() => [
    { id: 'hash', name: 'Hash Registry', component: <HashRegistry /> },
    { id: 'stamp', name: 'Stamp Registry', component: <StampRegistry /> },
    { id: 'tag', name: 'Tag Registry', component: <TagRegistry /> },
  ], []);

  const filteredRegistries = useMemo(() =>
    registries.filter(reg =>
      reg.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery, registries]);

  return (
    <ToastProvider>
      <WalletProvider>
        <FaviconManager />
        <div id="top" className="app">
          <LogicErrorBoundary>
            <a href="#main-content" className="skip-to-content">
              Skip to content
            </a>
            <PullToRefresh onRefresh={async () => {
              window.location.reload(); // Simple refresh for now
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
                <div className="search-wrapper" role="search">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Search registries (e.g., 'hash', 'tag')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        setSearchQuery('');
                      }
                    }}
                    className="search-input"
                    aria-label="Search registry cards"
                    aria-controls="registry-results"
                    aria-keyshortcuts="Esc"
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
                    <span>
                      Showing {filteredRegistries.length} of {registries.length} registries
                    </span>
                    <span className="text-[10px] opacity-70 animate-pulse-slow">
                      Last synchronized: {lastUpdated}
                    </span>
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      className="search-meta-reset"
                      onClick={() => setSearchQuery('')}
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
                      onClick={() => setSearchQuery(suggestion)}
                      className={twMerge(
                        "search-chip",
                        searchQuery.toLowerCase() === suggestion.toLowerCase() && "search-chip-active"
                      )}
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
              >
                {filteredRegistries.length > 0 ? (
                  filteredRegistries.map((reg, index) => (
                    <RegistryItem 
                      key={reg.id} 
                      component={reg.component} 
                      index={index} 
                    />
                  ))
                ) : (
                  <div className="col-span-full">
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
        </div>
      </WalletProvider>
    </ToastProvider>
  );
}

export default App;
