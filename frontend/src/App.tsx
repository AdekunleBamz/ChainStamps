import { useEffect, useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HashRegistry } from './components/HashRegistry';
import { StampRegistry } from './components/StampRegistry';
import { TagRegistry } from './components/TagRegistry';
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

  const registries = [
    { id: 'hash', name: 'Hash Registry', component: <HashRegistry /> },
    { id: 'stamp', name: 'Stamp Registry', component: <StampRegistry /> },
    { id: 'tag', name: 'Tag Registry', component: <TagRegistry /> },
  ];

  const filteredRegistries = registries.filter(reg =>
    reg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ToastProvider>
      <WalletProvider>
        <FaviconManager />
        <div className="app">
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

            <div className="filter-container">
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
            </div>

            <div className="cards-container">
              {filteredRegistries.length > 0 ? (
                filteredRegistries.map(reg => (
                  <div key={reg.id} className="registry-wrapper">
                    {reg.component}
                  </div>
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
            </div>
          </main>
          <Footer />
        </div>
      </WalletProvider>
    </ToastProvider>
  );
}

export default App;
