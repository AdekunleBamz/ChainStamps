import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, Copy, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { WalletConnectQRModal } from './WalletConnectQRModal';

export function Header() {
  const { isConnected, isConnecting, userAddress, connect, disconnect, wcUri, showQRModal, setShowQRModal } = useWallet();
  const [copied, setCopied] = useState(false);

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
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">⛓️</span>
            <span className="logo-text">ChainStamp</span>
          </div>
          
          <nav className="nav-links">
            <a href="#hash">Hash</a>
            <a href="#stamp">Stamp</a>
            <a href="#tag">Tag</a>
          </nav>

          <div className="wallet-section">
            {isConnected ? (
              <div className="wallet-connected">
                <button className="address-btn" onClick={copyAddress}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {truncateAddress(userAddress || '')}
                </button>
                <button className="disconnect-btn" onClick={disconnect}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="connect-btn" onClick={connect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 size={18} className="spinning" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet size={18} />
                    Connect Wallet
                  </>
                )}
              </button>
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
