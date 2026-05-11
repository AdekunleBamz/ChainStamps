import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { showConnect, AppConfig, UserSession } from '@stacks/connect';

/** Shared app config and user session — used for both auth and contract calls. */
export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

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
  /** Function to open the Hiro Wallet / Leather connect dialog. */
  connect: () => void;
  /** Function to sign out and clear the session. */
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

/**
 * Provider component for managing Stacks wallet connection state via Hiro Wallet / Leather.
 */
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  // Restore existing session on mount — handles both cached sessions and redirect-based auth
  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        const addr = userData?.profile?.stxAddress?.mainnet;
        if (addr) {
          setUserAddress(addr);
          setIsConnected(true);
        }
      }).catch(() => {});
    } else if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserAddress(userData.profile.stxAddress.mainnet);
      setIsConnected(true);
    }
  }, []);

  const connect = () => {
    showConnect({
      appDetails: { name: 'ChainStamps', icon: `${window.location.origin}/favicon.svg` },
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserAddress(userData.profile.stxAddress.mainnet);
        setIsConnected(true);
      },
      onCancel: () => {},
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    setIsConnected(false);
    setUserAddress(null);
  };

  return (
    <WalletContext.Provider value={{ isConnected, isConnecting, userAddress, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

/**
 * Custom hook to access the wallet context.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
