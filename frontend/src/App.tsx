import { useEffect, useState, useMemo } from 'react';
import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HashRegistry } from './components/HashRegistry';
import { StampRegistry } from './components/StampRegistry';
import { TagRegistry } from './components/TagRegistry';
import { Roadmap } from './components/Roadmap';
import { VerificationModule } from './components/VerificationModule';
import { TransactionHistory } from './components/TransactionHistory';
import { NetworkMetrics } from './components/NetworkMetrics';
import { Footer } from './components/Footer';
import { MeshGradient } from './components/MeshGradient';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ui/Toast';
import { updateFavicon } from './utils/favicon';
import { useWallet } from './context/WalletContext';
import { Search, Activity, Wallet, LogOut, Shield, Clock, Database, Menu, X, RefreshCw } from 'lucide-react';
import { Button } from './components/ui/Button';
import { CardSkeleton } from './components/ui/Skeleton';
import { PullToRefresh } from './components/ui/PullToRefresh';
import { EmptyState } from './components/ui/EmptyState';
import { LogicErrorBoundary } from './components/ui/LogicErrorBoundary';
import { PerformanceOverlay } from './components/ui/PerformanceOverlay';
import './App.css';

function FaviconManager() {
  const { isConnected, isConnecting } = useWallet();

  useEffect(() => {
    const status = isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected';
    updateFavicon(status);
  }, [isConnected, isConnecting]);

  return null;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const registries = useMemo(() => [
    { id: 'hash', name: 'Hash Registry', component: <HashRegistry /> },
    { id: 'stamp', name: 'Stamp Registry', component: <StampRegistry /> },
    { id: 'tag', name: 'Tag Registry', component: <TagRegistry /> },
    {
      id: 'verify', name: 'Verification Center', component: (
        <Suspense fallback={<CardSkeleton />}>
          <VerificationModule />
        </Suspense>
      )
    },
    {
      id: 'history', name: 'Transaction History', component: (
        <Suspense fallback={<CardSkeleton />}>
          <TransactionHistory />
        </Suspense>
      )
    },
  ], []);

  const filteredRegistries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return registries;

    return registries.filter(reg => {
      // Direct match in registry name
      if (reg.name.toLowerCase().includes(query)) return true;

      // If query looks like a hex string (hash/txid), it's highly relevant to all registries
      if (query.startsWith('0x') || query.length > 20) return true;

      return false;
    });
  }, [searchQuery, registries]);

  return (
    <ToastProvider>
      <WalletProvider>
        <FaviconManager />
        <div className="app">
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
            <main id="main-content" className="main">
              <Hero />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="filter-container"
              >
                <div className="search-wrapper">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Search registries (e.g., 'hash', 'tag')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="search-clear">
                      <X size={16} />
                    </button>
                  )}
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
                    <motion.div
                      key={reg.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="registry-wrapper"
                    >
                      {reg.component}
                    </motion.div>
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
        极      </WalletProvider>
    </ToastProvider>
  );
}

export default App;
