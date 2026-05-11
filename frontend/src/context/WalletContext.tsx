import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  connect as stacksConnect,
  disconnect as stacksDisconnect,
  isConnected as stacksIsConnected,
  getLocalStorage,
} from '@stacks/connect';

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
  /** Function to open the wallet connect dialog. */
  connect: () => void;
  /** Function to sign out and clear the session. */
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

/**
 * Provider component for managing Stacks wallet connection state via Hiro Wallet / Leather.
 * Uses the @stacks/connect v8 JSON-RPC API for modern wallet compatibility.
 */
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  // Restore existing session on mount
  useEffect(() => {
    if (stacksIsConnected()) {
      const data = getLocalStorage();
      const addr = data?.addresses?.stx?.[0]?.address ?? null;
      if (addr) {
        setUserAddress(addr);
        setIsConnected(true);
      }
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      await stacksConnect();
      const data = getLocalStorage();
      const addr = data?.addresses?.stx?.[0]?.address ?? null;
      if (addr) {
        setUserAddress(addr);
        setIsConnected(true);
      }
    } catch {
      // user cancelled or wallet error — ignore
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    stacksDisconnect();
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

