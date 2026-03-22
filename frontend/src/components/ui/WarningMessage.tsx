import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface WarningMessageProps {
  message?: string;
  showOnDisconnected?: boolean;
}

/**
 * Shared component for displaying warning messages or connection prompts.
 */
export const WarningMessage: React.FC<WarningMessageProps> = ({ 
  message = 'Connect your wallet to interact with this registry', 
  showOnDisconnected = true 
}) => {
  const { isConnected } = useWallet();

  if (isConnected && !message) return null;
  if (!isConnected && !showOnDisconnected) return null;

  const displayMessage = !isConnected ? 'Connect your wallet to interact with this registry' : message;

  return (
    <div className="warning-message flex-center gap-2">
      <AlertCircle size={18} />
      <span>{displayMessage}</span>
    </div>
  );
};
