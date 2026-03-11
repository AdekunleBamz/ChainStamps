import { useState, useEffect, useCallback } from 'react';
import { useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { ChainStampsService } from '../services/api';
import { Tag, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { CardSkeleton } from './ui/Skeleton';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';
import { RegistryLayout } from './RegistryLayout';
import { useFormDraft } from '../hooks/useFormDraft';

export function TagRegistry() {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [tag, setTag, clearDraft] = useFormDraft('tag_draft', { key: '', value: '' });
  const key = tag.key;
  const value = tag.value;
  const setKey = (k: string) => setTag({ ...tag, key: k });
  const setValue = (v: string) => setTag({ ...tag, value: v });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [txId, setTxId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const shake = useCallback(async () => {
    await controls.start({
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    });
  }, [controls]);

  const storeTag = useCallback(async () => {
    if (!key || !value || !isConnected || !userAddress) {
      if (!key || !value) {
        addToast('Please enter both key and value for the tag.', 'warning');
        shake();
      }
      return;
    }

    setStatus('submitting');

    try {
      const result = await ChainStampsService.storeTag(key, value);

      setTxId(result.txid);
      setStatus('success');
      clearDraft();
      addToast('Tag stored successfully!', 'success');
      triggerSuccessConfetti();
    } catch (error: any) {
      console.error('Transaction failed:', error);
      setStatus('error');
      addToast(error.message || 'Failed to store tag. Please try again.', 'error');
    }
  }, [key, value, isConnected, userAddress, addToast, shake]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (key && value && isConnected && status !== 'submitting') {
        storeTag();
      }
    }
  }, [key, value, isConnected, status, storeTag]);

  if (isLoading) return <CardSkeleton />;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <RegistryLayout
      id="tag"
      title="Tag Registry"
      description="Store key-value pairs permanently on the blockchain"
      icon={Tag}
      controls={controls}
      fee={{ value: 0.04, unit: "STX", tooltip: "Stacks network transaction fee (paid in STX)" }}
    >
      <div className="form-group">
        <input
          type="text"
          placeholder="Key (e.g., 'project-name')"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={64}
          className="input"
        />
        <span className="char-count">{key.length}/64</span>
      </div>

      <div className="form-group">
        <textarea
          placeholder="Value (e.g., 'ChainStamp v1.0')"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={256}
          rows={3}
          className="textarea"
        />
        <span className="char-count">{value.length}/256</span>
      </div>

      <Button
        onClick={storeTag}
        disabled={!key || !value || !isConnected || status === 'submitting'}
        variant="primary"
        size="lg"
        className="submit-btn w-full"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="spinning mr-2" size={18} strokeWidth={1.5} />
            Storing...
          </>
        ) : (
          'Store Tag On-Chain'
        )}
      </Button>

      {status === 'success' && txId && (
        <div className="success-message">
          <CheckCircle size={18} />
          <span>Tag stored! </span>
          <a
            href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View transaction
          </a>
        </div>
      )}

      {
        !isConnected && (
          <div className="warning-message">
            <AlertCircle size={18} />
            Connect your wallet to store tags
          </div>
        )
      }
    </RegistryLayout>
  );
}
