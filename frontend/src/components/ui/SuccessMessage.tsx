import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  txId?: string | null;
  explorerUrl?: string;
  children?: React.ReactNode;
}

/**
 * SuccessMessage component for displaying transaction feedback.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.message - The success message to display.
 * @param {string|null} props.txId - The Stacks transaction ID to link to the explorer.
 */
export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  txId, 
  explorerUrl = 'https://explorer.stacks.co/txid',
  children 
}) => {
  if (!message && !txId) return null;

  return (
    <div className="success-message flex-center gap-2" role="status" aria-live="polite">
      <CheckCircle size={18} />
      <span>{message} </span>
      {txId && (
        <a
          href={`${explorerUrl}/${txId}?chain=mainnet`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View transaction on Stacks Explorer"
        >
          View transaction
        </a>
      )}
      {children}
    </div>
  );
};
