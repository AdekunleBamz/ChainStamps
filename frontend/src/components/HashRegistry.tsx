import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { FileText, Hash } from 'lucide-react';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { CopyButton } from './ui/CopyButton';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { SuccessMessage } from './ui/SuccessMessage';
import { WarningMessage } from './ui/WarningMessage';
import { SubmitButton } from './ui/SubmitButton';
import { useToast } from '../context/ToastContext';
import { triggerHaptic } from '../utils/haptics';

/**
 * HashRegistry component for anchoring document fingerprints to the Stacks blockchain.
 * Supports:
 * - Client-side SHA-256 hashing of files
 * - Immutable storage of hashes with optional descriptions
 * - Real-time transaction status feedback
 * - Deep linking to the Stacks Explorer for verification
 */
import { useHashing } from '../hooks/useHashing';
import { useContractCall } from '../hooks/useContractCall';

const SHAKE_ANIMATION = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
};

export const HashRegistry = () => {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  const { hash, isHashing, computeHash } = useHashing();
  const { isSubmitting, txId, execute, reset: resetContract } = useContractCall();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleError = (msg: string) => {
    addToast(msg, 'error');
    controls.start(SHAKE_ANIMATION);
    triggerHaptic('error');
  };

  /**
   * Captures file selection from the input, computes its SHA-256 hash,
   * and resets the contract interaction state.
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        await computeHash(selectedFile);
        resetContract();
      } catch (err) {
        handleError('Failed to hash file');
      }
    }
  };

  const storeHash = async () => {
    if (!hash || !isConnected || !userAddress) {
      handleError('Please select a file first.');
      return;
    }

    try {
      await execute({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.hashRegistry.name,
        functionName: 'store-hash',
        functionArgs: [`0x${hash}`, description || 'Document hash'],
        stxAmount: CONTRACTS.hashRegistry.fee,
      }, 'Hash stored successfully!');
      setDescription('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (hash && isConnected && status !== 'submitting') {
        storeHash();
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) return <CardSkeleton />;

  return (
    <motion.section
      id="hash"
      className="card"
      variants={cardVariants}
      initial="initial"
      animate={controls}
    >
      <Breadcrumbs items={[{ label: 'Hash Registry' }]} />
      <div className="card-header flex-between mb-2">
        <div className="flex items-center gap-2">
          <Hash className="card-icon" size={24} strokeWidth={1.5} />
          <Tooltip content="Secure cryptographic identifier for your document">
            <span className="text-sm font-semibold text-muted-foreground mr-1">SHA-256</span>
          </Tooltip>
        </div>
        <h2>Hash Registry</h2>
        <Tooltip content="Stacks network transaction fee (paid in STX)">
          <span className="fee-badge">
            <AnimatedNumber value={0.03} decimals={2} suffix=" STX" />
          </span>
        </Tooltip>
      </div>

      <p className="card-description">
        Store SHA-256 document hashes on-chain for permanent verification
      </p>

      <div className="form-group">
        <label className="file-input-label flex-center">
          <FileText size={20} strokeWidth={1.5} />
          {file ? file.name : 'Choose a file to hash'}
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            onKeyDown={handleKeyDown}
            aria-label="Choose a file to generate its SHA-256 hash"
          />
        </label>
      </div>

      {hash && (
        <div className="hash-display flex-between gap-4">
          <div className="flex-1 overflow-hidden">
            <label className="text-xs text-muted-foreground uppercase font-bold mb-1 block">SHA-256 Hash:</label>
            <code className="block truncate text-primary/80">{hash}</code>
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
          aria-label="Optional description for the document hash"
          aria-required="false"
        />
      </div>

      <SubmitButton
        onClick={storeHash}
        isLoading={isSubmitting}
        disabled={!hash || !isConnected}
        loadingText="Storing..."
        idleText={isHashing ? 'Hashing...' : 'Store Hash On-Chain'}
        ariaBusy={isSubmitting || isHashing}
      />

      <SuccessMessage message="Hash stored!" txId={txId} />
      
      {!isConnected && <WarningMessage />}
    </motion.section >
  );
}
