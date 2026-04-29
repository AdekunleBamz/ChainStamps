import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';

/** Default message shown when no wallet is connected. */
const DISCONNECTED_WARNING = 'Connect your wallet to interact with this registry';

interface WarningMessageProps {
  message?: string;
  showOnDisconnected?: boolean;
}

export const WarningMessage: React.FC<WarningMessageProps> = ({ 
  message, 
  showOnDisconnected = true 
}) => {
  const { isConnected } = useWallet();

  const isVisible = (!isConnected && showOnDisconnected) || (isConnected && message);
  const displayMessage = !isConnected ? DISCONNECTED_WARNING : message;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="warning-message flex items-center justify-center gap-2 mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold"
        >
          <AlertCircle size={14} className="shrink-0" />
          <span>{displayMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
