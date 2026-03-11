import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { wcCallContract } from '../utils/walletconnect';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { FileText, Hash, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { CopyButton } from './ui/CopyButton';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';

export function HashRegistry() {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [hash, setHash] = useState('');
  const [status, setStatus] = useState<'idle' | 'hashing' | 'submitting' | 'success' | 'error'>('idle');
  const [txId, setTxId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const shake = async () => {
    await controls.start({
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    });
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const storeHash = async () => {
    if (!hash || !isConnected || !userAddress) {
      addToast('Please select a file or enter a hash first.', 'warning');
      shake();
      return;
    }

    setStatus('submitting');

    try {
      const result = await wcCallContract({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.hashRegistry.name,
        functionName: 'store-hash',
        functionArgs: [
          `0x${hash}`,
          description || 'Document hash',
        ],
        stxAmount: CONTRACTS.hashRegistry.fee,
      });

      setTxId(result.txid);
      setStatus('success');
      setDescription('');
      addToast('Hash stored successfully!', 'success');
      triggerSuccessConfetti();
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('error');
      addToast('Failed to store hash. Please try again.', 'error');
    }
  };

  if (isLoading) return <CardSkeleton />;

  return (
    <motion.section id="hash" className="card" animate={controls}>
      <Breadcrumbs items={[{ label: 'Hash Registry' }]} />
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Hash className="card-icon" size={24} strokeWidth={1.5} />
          <Tooltip content="Secure cryptographic identifier for your document">
            <span className="text-sm font-semibold text-muted-foreground mr-1">SHA-256</span>
          </Tooltip>
        </div>
        <h2>Hash Registry</h2>
        <Tooltip content="Stacks network transaction fee (paid in STX)">
          <span className="fee-badge">0.03 STX</span>
        </Tooltip>
      </div>

      <p className="card-description">
        Store SHA-256 document hashes on-chain for permanent verification
      </p>

      <div className="form-group">
        <label className="file-input-label">
          <FileText size={20} strokeWidth={1.5} />
          {file ? file.name : 'Choose a file to hash'}
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
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
    </motion.section >
  );
}
