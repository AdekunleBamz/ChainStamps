import { useState, useCallback } from 'react';
import { wcCallContract } from '../utils/walletconnect';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';

interface ContractCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: string[];
  stxAmount: number;
}

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : 'Transaction failed. Please try again.';

/**
 * Custom hook for making Stacks contract calls via WalletConnect.
 * Manages the full transaction lifecycle including:
 * - Loading/submission state
 * - Transaction ID tracking
 * - Success/Error toast notifications
 * - Triggering success animations (confetti)
 * 
 * @returns {Object} Call state and execute function.
 * @property {boolean} isSubmitting - True when a transaction is pending.
 * @property {string|null} txId - The Stacks transaction ID after successful broadcast.
 * @property {string|null} error - Error message if the call fails.
 * @property {function} execute - Function to trigger the contract call.
 * @property {function} reset - Function to clear the hook's state.
 */
export const useContractCall = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const execute = useCallback(async (params: ContractCallParams, successMessage = 'Transaction submitted successfully!') => {
    setIsSubmitting(true);
    setTxId(null);
    setError(null);

    try {
      const result = await wcCallContract(params);
      setTxId(result.txid);
      addToast(successMessage, 'success');
      triggerSuccessConfetti();
      return result;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      addToast(msg, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [addToast]);

  return {
    isSubmitting,
    txId,
    error,
    execute,
    /**
     * Resets the hook state, clearing any previous transaction ID or errors.
     * Useful when switching between different contract features or retrying.
     */
    reset: () => {
      setTxId(null);
      setError(null);
      setIsSubmitting(false);
    }
  };
};
