import { useState, useCallback, useEffect } from 'react';
import { wcCallContract } from '../utils/walletconnect';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';
import { updateFavicon } from '../utils/favicon';

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
  stxAmount?: number;
}

const getErrorMessage = (err: unknown) => {
  if (err instanceof Error) {
    if (err.message.includes('User rejected')) return 'Transaction cancelled by user. Feel free to try again when ready.';
    if (err.message.includes('insufficient balance')) return 'Insufficient STX balance. Please add funds to your wallet and try again.';
    if (err.message.includes('expired')) return 'Request timed out. Please ensure your wallet is open and try again.';
    return err.message;
  }
  return 'Transaction failed. Please check your connection and try again.';
};

const HISTORY_KEY = 'chainstamp_activity_history';
const generateActivityId = () =>
  globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2, 11);

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
      updateFavicon('pending');
      // Simulate preparing state for a moment to show the step
      await new Promise(resolve => setTimeout(resolve, 800));
      setStep('signing');

      const result = await wcCallContract(params);
      const newTxId = result.txid;
      setTxId(newTxId);
      setStep('pending');
      
      const newActivity: Activity = {
        id: generateActivityId(),
        type: params.contractName.includes('hash') ? 'hash' : params.contractName.includes('tag') ? 'tag' : 'stamp',
        label: label,
        txId: newTxId,
        timestamp: Date.now(),
      };

      setHistory((previousHistory) => {
        const updatedHistory = [newActivity, ...previousHistory].slice(0, 10);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        return updatedHistory;
      });

      addToast(successMessage, 'success');
      triggerSuccessConfetti();
      updateFavicon('confirmed');
      
      // Keep confirmed state for a few seconds
      setStep('confirmed');
      setTimeout(() => {
        setStep('idle');
        updateFavicon('connected');
      }, 5000);
      
      return result;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      setStep('error');
      updateFavicon('error');
      addToast(msg, 'error');
      setTimeout(() => {
        setStep('idle');
        updateFavicon('connected');
      }, 3000);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [addToast]);

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
