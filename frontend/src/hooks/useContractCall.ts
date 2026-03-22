import { useState, useCallback } from 'react';
import { wcCallContract } from '../utils/walletconnect';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';

interface ContractCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  stxAmount: number;
}

/**
 * Custom hook for making Stacks contract calls via WalletConnect.
 * Manages loading state, transaction ID, and provides toast notifications.
 * 
 * @returns {Object} Call state and execute function.
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
    } catch (err: any) {
      const msg = err.message || 'Transaction failed. Please try again.';
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
    reset: () => {
      setTxId(null);
      setError(null);
      setIsSubmitting(false);
    }
  };
};
