import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface WarningMessageProps {
  message?: string;
  showOnDisconnected?: boolean;
}

/**
 * WarningMessage component for displaying non-critical error or warning feedback.
 * This component can be used to prompt users to connect their wallet or display other warning messages.
 * 
 * @param {Object} props - Component properties.
 * @param {string} [props.message='Connect your wallet to interact with this registry'] - The warning message to display.
 *                                                                                     If not provided, a default message for wallet connection is used.
 * @param {boolean} [props.showOnDisconnected=true] - If true, the message is shown when the wallet is disconnected.
 *                                                    If false, the message will not be shown if the wallet is disconnected,
 *                                                    unless a specific `message` is provided.
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
