import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, Copy, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { WalletConnectQRModal } from './WalletConnectQRModal';
import { twMerge } from 'tailwind-merge';
import { Button } from './ui/Button';

export function Header() {
  const { isConnected, isConnecting, userAddress, connect, disconnect, wcUri, showQRModal, setShowQRModal } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (userAddress) {
      await navigator.clipboard.writeText(userAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <header className={twMerge(
        "header",
        isScrolled && "scrolled"
      )}>
        <div className="header-content">
          <div className="logo">
            <img src="/logo.png" alt="ChainStamps Logo" className="logo-img" />
            <span className="logo-text">ChainStamps</span>
          </div>

          <nav className="nav-links">
            <a href="#hash">Hash</a>
            <a href="#stamp">Stamp</a>
            <a href="#tag">Tag</a>
          </nav>

          <div className="wallet-section">
            {isConnected ? (
              <div className="wallet-connected">
                <Button
                  variant="secondary"
                  size="md"
                  className="address-btn font-mono"
                  onClick={copyAddress}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {truncateAddress(userAddress || '')}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="disconnect-btn"
                  onClick={disconnect}
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="connect-btn"
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={18} className="spinning mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet size={18} className="mr-2" />
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
