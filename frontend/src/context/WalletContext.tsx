import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { wcConnect, wcDisconnect, hasActiveSession, getSession, STACKS_MAINNET, getProvider } from '../utils/walletconnect';

/**
 * The structure of the wallet context, providing state and methods for wallet interaction.
 */
interface WalletContextType {
  /** Whether a wallet is currently connected. */
  isConnected: boolean;
  /** Whether a connection is currently being established. */
  isConnecting: boolean;
  /** The current user's Stacks address, or null if not connected. */
  userAddress: string | null;
  /** The current user's public key, if available. */
  publicKey: string | null;
  /** Function to initiate a WalletConnect connection. */
  connect: () => Promise<void>;
  /** Function to disconnect the current wallet session. */
  disconnect: () => Promise<void>;
  /** The current WalletConnect pairing URI for QR code display. */
  wcUri: string | null;
  /** Whether the WalletConnect QR modal should be visible. */
  showQRModal: boolean;
  /** Function to toggle the visibility of the QR modal. */
  setShowQRModal: (show: boolean) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const DEBUG = import.meta.env.VITE_DEBUG === 'true';

/**
 * Provides wallet connection state and methods to the application.
 * 
 * @param {Object} props - The component properties.
 * @param {ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The rendered provider component.
 */
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [wcUri, setWcUri] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      if (hasActiveSession()) {
        const session = getSession();
        if (session) {
          // Try to get address from session
          const accounts = session.namespaces?.stacks?.accounts || [];
          if (accounts.length > 0) {
            const parts = accounts[0].split(':');
            const address = parts[2] || parts[0];
            setUserAddress(address);
            setIsConnected(true);
            if (DEBUG) console.log('🔄 Restored session:', address);
          }
        }
      }
    };

    checkExistingSession();
  }, []);

  const connect = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setWcUri(null);

    try {
      const result = await wcConnect((uri) => {
        // Called when WC generates the pairing URI
        setWcUri(uri);
        setShowQRModal(true);
      });

      setUserAddress(result.address);
      setPublicKey(result.publicKey || null);
      setIsConnected(true);
      setShowQRModal(false);
      setWcUri(null);

      if (DEBUG) console.log('✅ Connected:', result.address);
    } catch (error) {
      console.error('❌ Connection failed:', error);
      setShowQRModal(false);
      setWcUri(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await wcDisconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    }

    setIsConnected(false);
    setUserAddress(null);
    setPublicKey(null);
    setWcUri(null);
    setShowQRModal(false);
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        userAddress,
        publicKey,
        connect,
        disconnect,
        wcUri,
        showQRModal,
        setShowQRModal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

/**
 * Custom hook to access the wallet context.
 * 
 * @returns {WalletContextType} The current wallet context value.
 * @throws {Error} If used outside of a WalletProvider.
 */
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Export for use in contract components
export { getProvider, STACKS_MAINNET };
