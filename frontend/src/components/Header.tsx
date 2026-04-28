import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, Loader2, Activity, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { WalletConnectQRModal } from './WalletConnectQRModal';
import { twMerge } from 'tailwind-merge';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { CopyButton } from './ui/CopyButton';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { STACKS_API_URL } from '../config/contracts';
import { BLOCK_FETCH_INTERVAL } from '../config/constants';

/** Stacks mainnet info API endpoint for fetching block height. */
const STACKS_INFO_API = `${STACKS_API_URL}/v2/info`;

/** Interval in milliseconds for refreshing block height data. */
const FETCH_INTERVAL = BLOCK_FETCH_INTERVAL;

/** Scroll event throttle threshold in pixels. */
const SCROLL_THRESHOLD = 20;

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
  const [activeHash, setActiveHash] = useState(window.location.hash);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ticking = useRef(false);
  
  useEffect(() => {
    const updateScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > SCROLL_THRESHOLD);
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll(); // Initialize state

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);

    const fetchBlockHeight = async () => {
      try {
        const response = await fetch(STACKS_INFO_API);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.stacks_tip_height && typeof data.stacks_tip_height === 'number') {
          setBlockHeight(data.stacks_tip_height);
        }
      } catch (error) {
        console.warn('Failed to fetch block height:', error);
      }
    };

    fetchBlockHeight();
    const interval = setInterval(fetchBlockHeight, FETCH_INTERVAL);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', handleHashChange);
      clearInterval(interval);
    };
  }, []);


  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const focusableElements = navRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
      handleTabKey(event);
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


  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.hash && link.origin === window.location.origin) {
        const id = link.hash.slice(1);
        const element = document.getElementById(id);
        
        if (element) {
          // If the element isn't focusable, make it so temporarily
          if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '-1');
            element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true });
          }
          element.focus();
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <>
      <a href="#hash" className="skip-link">Skip to Content</a>
      <header role="banner" className={twMerge(
        "header",
        isScrolled && "scrolled"
      )}>
        <div className="header-content flex-between">
          <a className="logo flex items-center gap-3 transition-transform hover:scale-[1.02]" href="#top" aria-label="ChainStamps - Back to top" rel="home">
            <div className="relative h-8 w-8 flex-center overflow-hidden rounded-xl bg-primary/10 border border-primary/20 shadow-inner">
              <svg viewBox="0 0 32 32" className="h-5 w-5 fill-primary" aria-hidden="true">
                <path d="M16 4L6 9v14l10 5 10-5V9L16 4zm8 17.5l-8 4-8-4V10.5l8-4 8 4v11z"/>
                <path d="M16 11l-4 2v6l4 2 4-2v-6l-4-2zm2 7.1l-2 1-2-1v-2.2l2-1 2 1v2.2z"/>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
            </div>
            <span className="logo-text text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">ChainStamps</span>
          </a>

                  <button
                    type="button"
                    className="mobile-menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    title={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                    aria-controls="primary-navigation"
                  >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>

          <nav
            id="primary-navigation"
            ref={navRef}
            aria-label="Main navigation links"
            className={twMerge("nav-links", isMenuOpen && "mobile-open")}
          >
            <ul className="flex items-center gap-6 list-none p-0 m-0">
              <li>
                <Tooltip content={
                  <div className="flex flex-col gap-1 p-1">
                    <div className="flex-between gap-4">
                      <span>Network:</span>
                      <span className="text-primary font-bold">Mainnet</span>
                    </div>
                    <div className="flex-between gap-4">
                      <span>Block Height:</span>
                      <span className="font-mono">{blockHeight || '---'}</span>
                    </div>
                    <div className="flex-between gap-4">
                      <span>Status:</span>
                      <span className="text-success font-bold">Operational</span>
                    </div>
                  </div>
                }>
                  <div className="network-heartbeat flex items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-full" aria-live="polite" aria-label={`Stacks Mainnet block height: ${blockHeight || 'Loading'}`} role="status">
                    <Activity size={12} className="mr-2 text-primary animate-pulse" strokeWidth={2.5} aria-hidden="true" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-2" aria-hidden="true">
                      Mainnet
                    </span>
                    <span className="text-xs font-mono text-primary font-bold" aria-hidden="true">
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
                  aria-current={activeHash === '#hash' ? 'page' : undefined}
                >Hash</a>
              </li>
              <li>
                <a 
                  href="#stamp" 
                  className="transition-base" 
                  onClick={() => setIsMenuOpen(false)} 
                  aria-label="Navigate to Stamp Registry section"
                  aria-current={activeHash === '#stamp' ? 'page' : undefined}
                >Stamp</a>
              </li>
              <li>
                <a 
                  href="#tag" 
                  className="transition-base" 
                  onClick={() => setIsMenuOpen(false)} 
                  aria-label="Navigate to Tag Registry section"
                  aria-current={activeHash === '#tag' ? 'page' : undefined}
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
                  <Tooltip content={userAddress || ''}>
                    <span className="text-sm font-mono text-muted-foreground mr-1 cursor-help" aria-label={`Wallet address: ${userAddress || 'Not connected'}`}>
                      {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                    </span>
                  </Tooltip>
                  <CopyButton value={userAddress || ''} size={14} className="h-8 w-8" />
                </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="disconnect-btn rounded-xl"
                    onClick={disconnect}
                    title="Disconnect Wallet"
                    aria-label="Disconnect Stacks Wallet"
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
                    aria-busy={isConnecting}
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
