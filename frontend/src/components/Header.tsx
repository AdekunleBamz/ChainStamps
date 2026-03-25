import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, Loader2, Activity, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { WalletConnectQRModal } from './WalletConnectQRModal';
import { twMerge } from 'tailwind-merge';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { CopyButton } from './ui/CopyButton';
import { AnimatedNumber } from './ui/AnimatedNumber';

const STACKS_INFO_API = 'https://api.mainnet.hiro.so/v2/info';
const FETCH_INTERVAL = 30000; // 30 seconds

/**
 * Global Header component that serves as the primary navigation and wallet interaction hub.
 * Provides site-wide navigation, logo, and wallet connection status.
 * Features:
 * - Responsive navigation links
 * - Real-time Stacks block height display
 * - Stacks wallet connection/disconnection management
 * - Scrolled state background transformation
 * Handles mobile menu toggle and sticky scroll behavior.
 * 
 * @component
 */
export const Header = () => {
  const { isConnected, isConnecting, userAddress, connect, disconnect, wcUri, showQRModal, setShowQRModal } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ticking = useRef(false);
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    const fetchBlockHeight = async () => {
      try {
        const response = await fetch(STACKS_INFO_API);
        const data = await response.json();
        setBlockHeight(data.stacks_tip_height);
      } catch (error) {
        console.error('Failed to fetch block height:', error);
      }
    };

    fetchBlockHeight();
    const interval = setInterval(fetchBlockHeight, FETCH_INTERVAL);

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
      <header role="banner" className={twMerge(
        "header",
        isScrolled && "scrolled"
      )}>
        <div className="header-content flex-between">
          <a className="logo flex-center" href="#top" aria-label="ChainStamps - Back to top" rel="home">
            <img src="/logo.png" alt="ChainStamps Logo" className="logo-img will-change-transform" width="32" height="32" decoding="async" />
            <span className="logo-text">ChainStamps</span>
          </a>

                  <button
                    type="button"
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
            <ul className="flex items-center gap-6 list-none p-0 m-0">
              <li>
                <Tooltip content="Current Stacks network block height">
                <div className="network-heartbeat" aria-live="polite" aria-label={`Current Stacks block height: ${blockHeight || 'Loading'}`}>
                    <Activity size={14} className="mr-1 text-primary animate-pulse" strokeWidth={2} aria-hidden="true" />
                    <span className="text-xs font-mono text-muted-foreground" aria-hidden="true">
                      {blockHeight ? (
                        <AnimatedNumber value={blockHeight} prefix="#" />
                      ) : (
                        '---'
                      )}
                    </span>
                  </div>
                </Tooltip>
              </li>
              <li>
                <a 
                  href="#hash" 
                  className="transition-base" 
                  onClick={() => setIsMenuOpen(false)} 
                  aria-label="Navigate to Hash Registry section"
                  aria-current={window.location.hash === '#hash' ? 'page' : undefined}
                >Hash</a>
              </li>
              <li>
                <a 
                  href="#stamp" 
                  className="transition-base" 
                  onClick={() => setIsMenuOpen(false)} 
                  aria-label="Navigate to Stamp Registry section"
                  aria-current={window.location.hash === '#stamp' ? 'page' : undefined}
                >Stamp</a>
              </li>
              <li>
                <a 
                  href="#tag" 
                  className="transition-base" 
                  onClick={() => setIsMenuOpen(false)} 
                  aria-label="Navigate to Tag Registry section"
                  aria-current={window.location.hash === '#tag' ? 'page' : undefined}
                >Tag</a>
              </li>
            </ul>
          </nav>

          <div className="wallet-section">
            <div 
              className={twMerge(
                "status-pulse",
                isConnected ? "connected" : isConnecting ? "connecting" : "disconnected"
              )} 
              style={{ marginRight: '12px' }} 
              role="status"
              aria-live="polite"
              aria-label={`Wallet connection status: ${isConnected ? "Connected" : isConnecting ? "Connecting" : "Disconnected"}`}
            />
            {isConnected ? (
              <div className="wallet-connected flex-center gap-2">
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
                  className="connect-btn flex-center"
                  onClick={connect}
                  disabled={isConnecting}
                  aria-haspopup="dialog"
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
