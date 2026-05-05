import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { wcConnect, wcDisconnect, hasActiveSession, getSession, STACKS_MAINNET, getProvider, initProvider } from '../utils/walletconnect';
import { useToast } from './ToastContext';

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
 * Provider component for managing Stacks wallet connection state.
 * Handles WalletConnect sessions, QR modal visibility, and account metadata.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The child components to render within the provider.
 */
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { addToast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [wcUri, setWcUri] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  /**
   * Effect hook to check for and restore any existing WalletConnect sessions
   * on component mount. This ensures persistence across page reloads.
   */
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // Initialize provider FIRST to check for existing session
        await initProvider();

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
      } catch (error) {
        if (DEBUG) console.warn('WalletConnect session restore skipped:', error);
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
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      if (message.includes('VITE_WALLETCONNECT_PROJECT_ID')) {
        addToast('WalletConnect is not configured. Set VITE_WALLETCONNECT_PROJECT_ID in your environment.', 'error');
      } else if (message.includes('User rejected') || message.includes('rejected')) {
        addToast('Connection cancelled.', 'info');
      } else {
        addToast(`Connection failed: ${message}`, 'error');
      }
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
// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Export for use in contract components
// eslint-disable-next-line react-refresh/only-export-components
export { getProvider, STACKS_MAINNET };
