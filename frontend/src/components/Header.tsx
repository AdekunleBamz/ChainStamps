import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, Loader2, Activity, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { WalletConnectQRModal } from './WalletConnectQRModal';
import { twMerge } from 'tailwind-merge';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { CopyButton } from './ui/CopyButton';
import { AnimatedNumber } from './ui/AnimatedNumber';

export function Header() {
  const { isConnected, isConnecting, userAddress, connect, disconnect, wcUri, showQRModal, setShowQRModal } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const fetchBlockHeight = async () => {
      try {
        const response = await fetch('https://api.mainnet.hiro.so/v2/info');
        const data = await response.json();
        setBlockHeight(data.stacks_tip_height);
      } catch (error) {
        console.error('Failed to fetch block height:', error);
      }
    };

    fetchBlockHeight();
    const interval = setInterval(fetchBlockHeight, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (!mediaQuery.matches) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);


  return (
    <>
      <header className={twMerge(
        "header",
        isScrolled && "scrolled"
      )}>
        <div className="header-content">
          <a className="logo" href="#top" aria-label="ChainStamps - Back to top">
            <img src="/logo.png" alt="ChainStamps Logo" className="logo-img" />
            <span className="logo-text">ChainStamps</span>
          </a>

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav
            id="primary-navigation"
            aria-label="Main navigation links"
            className={twMerge("nav-links", isMenuOpen && "mobile-open")}
          >
            <Tooltip content="Current Stacks network block height">
              <div className="network-heartbeat">
                <Activity size={14} className="mr-1 text-primary animate-pulse" strokeWidth={2} />
                <span className="text-xs font-mono text-muted-foreground">
                  {blockHeight ? (
                    <AnimatedNumber value={blockHeight} prefix="#" />
                  ) : (
                    '---'
                  )}
                </span>
              </div>
            </Tooltip>
            <a href="#hash" onClick={() => setIsMenuOpen(false)} aria-label="Navigate to Hash Registry section">Hash</a>
            <a href="#stamp" onClick={() => setIsMenuOpen(false)} aria-label="Navigate to Stamp Registry section">Stamp</a>
            <a href="#tag" onClick={() => setIsMenuOpen(false)} aria-label="Navigate to Tag Registry section">Tag</a>
          </nav>

          <div className="wallet-section">
            <div className={twMerge(
              "status-pulse",
              isConnected ? "connected" : isConnecting ? "connecting" : "disconnected"
            )} style={{ marginRight: '12px' }} title={isConnected ? "Connected" : isConnecting ? "Connecting..." : "Disconnected"} />
            {isConnected ? (
              <div className="wallet-connected flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background/50 pl-3 pr-1 py-1 shadow-inner">
                  <span className="text-sm font-mono text-muted-foreground mr-1">
                    {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                  </span>
                  <CopyButton value={userAddress || ''} size={14} className="h-8 w-8" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="disconnect-btn rounded-xl"
                  onClick={disconnect}
                  title="Disconnect Wallet"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                </Button>
              </div>
            ) : (
                <Button
                  variant="primary"
                  size="md"
                  className="connect-btn"
                  onClick={connect}
                  disabled={isConnecting}
                  aria-label={isConnecting ? "Connecting to wallet" : "Connect Stacks wallet"}
                >
                {isConnecting ? (
                  <>
                    <Loader2 size={18} className="spinning mr-2" strokeWidth={1.5} />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet size={18} className="mr-2" strokeWidth={1.5} />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      {showQRModal && wcUri && (
        <WalletConnectQRModal uri={wcUri} onClose={() => setShowQRModal(false)} />
      )}
    </>
  );
}
