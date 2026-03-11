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
import './App.css';

function App() {
  return (
    <ToastProvider>
      <WalletProvider>
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
