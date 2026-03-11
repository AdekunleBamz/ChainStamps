import { useState, useEffect, useCallback } from 'react';
import { useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { ChainStampsService } from '../services/api';
import { FileText, Hash, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { CardSkeleton } from './ui/Skeleton';
import { CopyButton } from './ui/CopyButton';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';
import { RegistryLayout } from './RegistryLayout';
import { useTabFeedback } from '../hooks/useTabFeedback';
import { useTabFeedback } from '../hooks/useTabFeedback';

export function HashRegistry() {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [hash, setHash] = useState('');
  const [status, setStatus] = useState<'idle' | 'hashing' | 'submitting' | 'success' | 'error'>('idle');

  useTabFeedback(status === 'hashing' ? 'submitting' : status);
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
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('hashing');

      const buffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setHash(hashHex);
      setStatus('idle');
    }
  }, []);

  const storeHash = useCallback(async () => {
    if (!hash || !isConnected || !userAddress) {
      addToast('Please select a file or enter a hash first.', 'warning');
      shake();
      return;
    }

    setStatus('submitting');

    try {
      const result = await ChainStampsService.storeHash(hash, description);

      setTxId(result.txid);
      setStatus('success');
      setDescription('');
      addToast('Hash stored successfully!', 'success');
      triggerSuccessConfetti();
    } catch (error: any) {
      console.error('Transaction failed:', error);
      setStatus('error');
      addToast(error.message || 'Failed to store hash. Please try again.', 'error');
    }
  }, [hash, isConnected, userAddress, description, addToast, shake]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (hash && isConnected && status !== 'submitting') {
        storeHash();
      }
    }
  }, [hash, isConnected, status, storeHash]);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) return <CardSkeleton />;

  return (
    <RegistryLayout
      id="hash"
      title="Hash Registry"
      description="Store SHA-256 document hashes on-chain for permanent verification"
      icon={Hash}
      controls={controls}
      headerBadge={{ label: "SHA-256", tooltip: "Secure cryptographic identifier for your document" }}
      fee={{ value: 0.03, unit: "STX", tooltip: "Stacks network transaction fee (paid in STX)" }}
    >
      <div className="form-group">
        <label className="file-input-label">
          <FileText size={20} strokeWidth={1.5} />
          {file ? file.name : 'Choose a file to hash'}
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            onKeyDown={handleKeyDown}
          />
        </label>
      </div>

      {hash && (
        <div className="hash-display flex items-center justify-between">
          <div className="flex-1 overflow-hidden">
            <label>SHA-256 Hash:</label>
            <code className="block truncate">{hash}</code>
          </div>
          <CopyButton value={hash} size={16} className="ml-2 h-8 w-8" />
        </div>
      )}

      <div className="form-group">
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={128}
          className="input"
          onKeyDown={handleKeyDown}
        />
      </div>

      <Button
        onClick={storeHash}
        disabled={!hash || !isConnected || status === 'submitting'}
        variant="primary"
        size="lg"
        className="submit-btn w-full"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="spinning mr-2" size={18} strokeWidth={1.5} />
            Storing...
          </>
        ) : status === 'hashing' ? (
          <>
            <Loader2 className="spinning mr-2" size={18} strokeWidth={1.5} />
            Hashing...
          </>
        ) : (
          'Store Hash On-Chain'
        )}
      </Button>

      {
        status === 'success' && txId && (
          <div className="success-message">
            <CheckCircle size={18} />
            <span>Hash stored! </span>
            <a
              href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View transaction
            </a>
          </div>
        )
      }

      {
        !isConnected && (
          <div className="warning-message">
            <AlertCircle size={18} />
            Connect your wallet to store hashes
          </div>
        )
      }
    </RegistryLayout>
  );
}
