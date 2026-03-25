import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { twMerge } from 'tailwind-merge';
import { FileText, Hash, Share2, ExternalLink } from 'lucide-react';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { CopyButton } from './ui/CopyButton';
import { Button } from './ui/Button';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { SuccessMessage } from './ui/SuccessMessage';
import { WarningMessage } from './ui/WarningMessage';
import { SubmitButton } from './ui/SubmitButton';
import { useToast } from '../context/ToastContext';
import { triggerHaptic } from '../utils/haptics';
import { estimateFee } from '../utils/fee';
import { RecentActivity } from './ui/RecentActivity';

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
  const { isSubmitting, txId, execute, reset: resetContract, history } = useContractCall();

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
      } catch {
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
      }, 'Hash stored successfully!', file?.name || 'Document Hash');
      setDescription('');
    } catch {
      // Error handled by hook
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (hash && isConnected && !isSubmitting) {
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
      <div className="card-header flex-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Hash className="card-icon text-primary" size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold m-0 p-0 leading-none">Hash Registry</h2>
            <Tooltip content="Secure cryptographic identifier for your document">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">SHA-256 Anchoring</span>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip content="View contract on Stacks Explorer">
            <a
              href={`https://explorer.stacks.co/txid/${CONTRACT_ADDRESS}.${CONTRACTS.hashRegistry.name}?chain=mainnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 flex-center rounded-full opacity-40 hover:opacity-100 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
              aria-label="View contract on Stacks Explorer"
            >
              <ExternalLink size={16} strokeWidth={1.5} />
            </a>
          </Tooltip>
          <Tooltip content="Copy link to this section">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-40 hover:opacity-100 hover:bg-primary/10 transition-all"
              onClick={() => {
                const url = new URL(window.location.href);
                url.hash = 'hash';
                navigator.clipboard.writeText(url.toString());
                addToast('Section link copied!', 'success');
                triggerHaptic('success');
              }}
              aria-label="Copy link to Hash Registry section"
            >
              <Share2 size={16} strokeWidth={1.5} />
            </Button>
          </Tooltip>
          <Tooltip 
            content={
              <div className="flex flex-col gap-1 p-1">
                <div className="flex-between gap-4">
                  <span>Base Network Fee:</span>
                  <span className="font-mono">0.0010 STX</span>
                </div>
                <div className="flex-between gap-4">
                  <span>Data Storage Cost:</span>
                  <span className="font-mono">{(estimateFee(hash ? 32 : 0) - 0.001).toFixed(4)} STX</span>
                </div>
                <div className="border-t border-white/10 mt-1 pt-1 flex-between gap-4 font-bold text-primary">
                  <span>Total Estimated:</span>
                  <span className="font-mono">{(estimateFee(hash ? 32 : 0)).toFixed(4)} STX</span>
                </div>
              </div>
            }
          >
            <span className="fee-badge bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
              <AnimatedNumber value={estimateFee(hash ? 32 : 0)} decimals={4} suffix=" STX" />
            </span>
          </Tooltip>
        </div>
      </div>

      <p className="card-description">
        Store SHA-256 document hashes on-chain for permanent verification
      </p>

      <div className={twMerge("relative", isSubmitting && "pointer-events-none")}>
        <div className="form-group">
          <label 
            className={twMerge(
              "file-input-label flex-center flex-col gap-3 p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer",
              file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-white/5",
              isSubmitting && "opacity-50"
            )}
          >
            <div className="p-4 bg-primary/10 rounded-full">
              <FileText size={32} className="text-primary" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="font-bold text-sm mb-1">{file ? file.name : 'Click to upload or drag & drop'}</p>
              <p className="text-xs text-muted-foreground">{file ? `${(file.size / 1024).toFixed(1)} KB` : 'SHA-256 Hashing happens locally'}</p>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input"
              onKeyDown={handleKeyDown}
              aria-label="Choose a file to generate its SHA-256 hash"
            />
          </label>
        </div>

        {(isHashing || hash) && (
          <div className={twMerge("hash-status-container p-4 bg-white/5 rounded-xl border border-white/10 mb-6", isSubmitting && "opacity-50")}>
            {isHashing ? (
              <div className="flex flex-col gap-2">
                <div className="flex-between text-xs font-bold uppercase tracking-wider text-primary">
                  <span>Computing Hash...</span>
                  <span>Wait</span>
                </div>
                <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="hash-display flex-between gap-4">
                <div className="flex-1 overflow-hidden text-left">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold mb-1 block">SHA-256 Fingerprint:</label>
                  <code className="block truncate text-primary/80 font-mono text-sm">{hash}</code>
                </div>
                <CopyButton value={hash || ''} size={16} className="ml-2 h-8 w-8 rounded-lg bg-primary/10" />
              </div>
            )}
          </div>
        )}

        <div className="form-group mb-6">
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={128}
            className={twMerge("input", isSubmitting && "opacity-50")}
            onKeyDown={handleKeyDown}
            aria-label="Optional description for the document hash"
            aria-required="false"
          />
          <span 
            className={twMerge(
              "char-count text-[10px] mt-1 block text-right",
              description.length >= 128 ? "text-destructive" : description.length >= 115 ? "text-orange-500" : "text-muted-foreground/50"
            )} 
            aria-live="polite"
          >
            {description.length}/128
          </span>
        </div>

        {isSubmitting && (
          <div className="absolute inset-0 z-10 flex-center bg-background/20 backdrop-blur-[1px] rounded-2xl pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-lg"
            >
              Confirm in Wallet
            </motion.div>
          </div>
        )}
      </div>

      <SubmitButton
        onClick={storeHash}
        isLoading={isSubmitting}
        disabled={!hash || !isConnected}
        loadingText="Storing..."
        idleText={isHashing ? 'Hashing...' : 'Store Hash On-Chain'}
        ariaBusy={isSubmitting || isHashing}
      />

      <RecentActivity 
        activities={history.filter(a => a.type === 'hash')} 
        className="mt-6 pt-6 border-t border-white/5"
      />

      <SuccessMessage message="Hash stored!" txId={txId} />
      
      {!isConnected && <WarningMessage />}
    </motion.section >
  );
}
