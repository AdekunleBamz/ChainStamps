import { useState, useCallback, useEffect } from 'react';
import { wcCallContract } from '../utils/walletconnect';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';

export type TransactionStep = 'idle' | 'preparing' | 'signing' | 'pending' | 'confirmed' | 'error';

interface Activity {
  id: string;
  type: 'hash' | 'stamp' | 'tag';
  label: string;
  txId: string;
  timestamp: number;
}

interface ContractCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  stxAmount: number;
}

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : 'Transaction failed. Please try again.';

const HISTORY_KEY = 'chainstamp_activity_history';

/**
 * Custom hook for making Stacks contract calls via WalletConnect.
 * Manages the full transaction lifecycle and local history persistence.
 */
export const useContractCall = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<TransactionStep>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Activity[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }, []);

  const execute = useCallback(async (params: ContractCallParams, successMessage = 'Transaction submitted successfully!', label = 'Unknown Action') => {
    setIsSubmitting(true);
    setStep('preparing');
    setTxId(null);
    setError(null);

    try {
      // Simulate preparing state for a moment to show the step
      await new Promise(resolve => setTimeout(resolve, 800));
      setStep('signing');

      const result = await wcCallContract(params);
      const newTxId = result.txid;
      setTxId(newTxId);
      setStep('pending');
      
      const newActivity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        type: params.contractName.includes('hash') ? 'hash' : params.contractName.includes('tag') ? 'tag' : 'stamp',
        label: label,
        txId: newTxId,
        timestamp: Date.now(),
      };

      const updatedHistory = [newActivity, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

      addToast(successMessage, 'success');
      triggerSuccessConfetti();
      
      // Keep confirmed state for a few seconds
      setStep('confirmed');
      setTimeout(() => setStep('idle'), 5000);
      
      return result;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      setStep('error');
      addToast(msg, 'error');
      setTimeout(() => setStep('idle'), 3000);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [addToast, history]);

  return {
    isSubmitting,
    step,
    txId,
    error,
    history,
    execute,
    reset: () => {
      setTxId(null);
      setError(null);
      setIsSubmitting(false);
      setStep('idle');
    }
  };
};
