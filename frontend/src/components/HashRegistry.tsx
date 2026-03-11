import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { BASE_NETWORK_FEE_STX, CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { twMerge } from 'tailwind-merge';
import { FileText, Hash, Share2, ExternalLink, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { Button } from './ui/Button';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { SuccessMessage } from './ui/SuccessMessage';
import { WarningMessage } from './ui/WarningMessage';
import { SubmitButton } from './ui/SubmitButton';
import { triggerHaptic } from '../utils/haptics';
import { RecentActivity } from './ui/RecentActivity';
import { HighlightText } from './ui/HighlightText';
import { TransactionStepper } from './ui/TransactionStepper';
import { useContractCall } from '../hooks/useContractCall';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';
import { RegistryLayout } from './RegistryLayout';

/** Pre-computed shake animation variant for form validation errors. */
const SHAKE_ANIMATION = ANIMATIONS.SHAKE;

/** Rate limit interval for hash submission in milliseconds. */
const RATE_LIMIT_INTERVAL = UI.RATE_LIMIT_COOLDOWN;

/** Hash algorithm identifier used with crypto.subtle.digest. */
const HASH_ALGORITHM = 'SHA-256';

/** Number of hex characters to display in shortened hash previews. */
const HASH_PREVIEW_LENGTH = 16;

/** Regular expression pattern for validating SHA-256 hash format. */
const HASH_VALIDATION_PATTERN = /^[a-fA-F0-9]{64}$/;

/**
 * HashRegistry component for storing and verifying SHA-256 hashes on the Stacks blockchain.
 */
export const HashRegistry = memo(({ searchQuery = '' }: { searchQuery?: string }) => {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [hash, setHash] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();
  const { isSubmitting, step, txId, execute, history } = useContractCall();
  const { fees } = useOnChainFees();
  const hashFee = fees.hash;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), UI.SKELETON_DELAY);
    return () => {
      clearTimeout(timer);
    };
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
      if (!hash) {
        addToast('Please enter a SHA-256 hash to register.', 'warning');
        shake();
      }
      return;
    }

    if (!HASH_VALIDATION_PATTERN.test(hash)) {
      addToast('Invalid SHA-256 hash format.', 'error');
      shake();
      return;
    }

    try {
      const hashPairs = hash.match(/.{2}/g);
      if (!hashPairs) {
        throw new Error('Failed to parse hash input.');
      }

      const hashBytes = Uint8Array.from(hashPairs.map((byte) => parseInt(byte, 16)));
      const description = `ChainStamp hash ${hash.slice(0, HASH_PREVIEW_LENGTH)}...`;

      await execute({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.hashRegistry.name,
        functionName: 'store-hash',
        functionArgs: [
          cvToHex(bufferCV(hashBytes)),
          cvToHex(stringUtf8CV(description)),
        ],
      }, 'Hash registered successfully!', hash.slice(0, HASH_PREVIEW_LENGTH) + '...');
      setHash('');
      setLastSubmitTime(Date.now());
    } catch {
      // Error handled by hook
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
      addToast('File hashed successfully!', 'success');
      triggerHaptic('success');
    } catch (error) {
      addToast('Failed to hash file.', 'error');
      triggerHaptic('error');
    }
  }, [hash, isConnected, userAddress, description, addToast, shake]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (hash && isConnected && !isSubmitting) {
        storeHash();
      }
    }
  }, [hash, isConnected, status, storeHash]);

  if (isLoading) return <CardSkeleton />;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const isHashValid = HASH_VALIDATION_PATTERN.test(hash);

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
        </div>

        <TransactionStepper currentStep={step} />

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
        disabled={!hash || !isConnected || !isHashValid}
        loadingText="Registering..."
        idleText="Register Hash On-Chain"
        ariaBusy={isSubmitting}
      />

      <RecentActivity 
        activities={history.filter(a => a.type === 'hash')} 
        className="mt-6 pt-6 border-t border-white/5"
      />

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
});

export default HashRegistry;
