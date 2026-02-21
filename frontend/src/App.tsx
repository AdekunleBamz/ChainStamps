import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HashRegistry } from './components/HashRegistry';
import { StampRegistry } from './components/StampRegistry';
import { TagRegistry } from './components/TagRegistry';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <div className="app">
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
  );
}

export default App;
