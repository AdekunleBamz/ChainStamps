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
  return (
    <ToastProvider>
      <WalletProvider>
        <FaviconManager />
        <div className="app">
          <MeshGradient />
          <ToastContainer />
          <Header />
          <main className="main">
            <Hero />
            <div className="cards-container">
              <HashRegistry />
              <StampRegistry />
              <TagRegistry />
            </div>
          </main>
          <Footer />
        </div>
      </WalletProvider>
    </ToastProvider>
  );
}

export default App;
