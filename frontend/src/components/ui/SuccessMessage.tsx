import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/** Default Hiro Explorer URL for transaction links. */
const DEFAULT_EXPLORER_URL = 'https://explorer.hiro.so/txid';

/** Stacks mainnet chain query parameter appended to explorer links. */
const EXPLORER_CHAIN = 'mainnet';

interface SuccessMessageProps {
  message: string;
  txId?: string | null;
  explorerUrl?: string;
  children?: React.ReactNode;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  txId, 
  explorerUrl = DEFAULT_EXPLORER_URL,
  children 
}) => {
  return (
    <AnimatePresence>
      {(message || txId) && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="success-message flex items-center justify-center gap-2 mt-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-bold shadow-sm shadow-success/5"
          role="status"
          aria-live="polite"
        >
          <CheckCircle size={14} className="shrink-0" />
          <span className="truncate">{message} </span>
          {txId && (
            <a
              href={`${explorerUrl}/${txId}?chain=${EXPLORER_CHAIN}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 underline underline-offset-4 hover:opacity-80 transition-opacity"
              aria-label="View transaction on Hiro Explorer"
            >
              Details
              <ExternalLink size={10} />
            </a>
          )}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
