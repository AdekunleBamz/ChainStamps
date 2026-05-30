import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  connect as stacksConnect,
  disconnect as stacksDisconnect,
  isConnected as stacksIsConnected,
  getLocalStorage,
} from '@stacks/connect';
import { WalletPickerModal } from '../components/WalletPickerModal';

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
  const [isWalletPickerOpen, setIsWalletPickerOpen] = useState(false);

  // Restore existing session from localStorage on first mount
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

  const connectWithExtension = useCallback(async () => {
    setIsConnecting(true);
    try {
      setIsWalletPickerOpen(false);
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
  }, []);

  const connect = useCallback(() => {
    setIsWalletPickerOpen(true);
  }, []);

  const closeWalletPicker = useCallback(() => {
    if (!isConnecting) {
      setIsWalletPickerOpen(false);
    }
  }, [isConnecting]);

  const disconnect = useCallback(() => {
    stacksDisconnect();
    setIsConnected(false);
  }, []);

  return (
    <WalletContext.Provider value={{ isConnected, isConnecting, userAddress, connect, disconnect }}>
      {children}
      {isWalletPickerOpen && (
        <WalletPickerModal
          onSelectHiro={connectWithExtension}
          onSelectWalletConnect={connectWithExtension}
          onClose={closeWalletPicker}
        />
      )}
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
