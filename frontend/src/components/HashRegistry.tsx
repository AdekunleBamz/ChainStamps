import { useState, useEffect, memo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
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
import { ANIMATIONS, UI } from '../config/constants';
import { bufferCV, cvToHex, stringUtf8CV } from '@stacks/transactions';
import { useOnChainFees } from '../hooks/useOnChainFees';

/** Pre-computed shake animation variant for form validation errors. */
const SHAKE_ANIMATION = ANIMATIONS.SHAKE;

/** Rate limit interval for hash submission in milliseconds. */
const RATE_LIMIT_INTERVAL = UI.RATE_LIMIT_COOLDOWN;

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

  const shake = () => {
    controls.start(SHAKE_ANIMATION);
    triggerHaptic('error');
  };

  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const storeHash = async () => {
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_INTERVAL) return;
    
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
      const description = `ChainStamp hash ${hash.slice(0, 16)}...`;

      await execute({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.hashRegistry.name,
        functionName: 'store-hash',
        functionArgs: [
          cvToHex(bufferCV(hashBytes)),
          cvToHex(stringUtf8CV(description)),
        ],
      }, 'Hash registered successfully!', hash.slice(0, 16) + '...');
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
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
      addToast('File hashed successfully!', 'success');
      triggerHaptic('success');
    } catch (error) {
      addToast('Failed to hash file.', 'error');
      triggerHaptic('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (hash && isConnected && !isSubmitting) {
        storeHash();
      }
    }
  };

  if (isLoading) return <CardSkeleton />;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const isHashValid = HASH_VALIDATION_PATTERN.test(hash);

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
            <h2 className="text-xl font-bold m-0 p-0 leading-none">
              <HighlightText text="Hash Registry" query={searchQuery} />
            </h2>
            <Tooltip content="Register SHA-256 hashes to create a permanent, verifiable proof of existence for any digital file.">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Immutable Verification</span>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip content="View contract on Hiro Explorer">
            <a
              href={`https://explorer.hiro.so/address/${CONTRACT_ADDRESS}.${CONTRACTS.hashRegistry.name}?chain=mainnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 flex-center rounded-full opacity-40 hover:opacity-100 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
              aria-label="View contract on Hiro Explorer"
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
                  <span className="font-mono">{BASE_NETWORK_FEE_STX.toFixed(4)} STX</span>
                </div>
                <div className="flex-between gap-4">
                  <span>Registration Fee:</span>
                  <span className="font-mono">{hashFee.toFixed(4)} STX</span>
                </div>
                <div className="border-t border-white/10 mt-1 pt-1 flex-between gap-4 font-bold text-primary">
                  <span>Total Due:</span>
                  <span className="font-mono">{(hashFee + BASE_NETWORK_FEE_STX).toFixed(4)} STX</span>
                </div>
              </div>
            }
            aria-label="Fee breakdown for hash registration"
          >
            <span className="fee-badge bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
              <AnimatedNumber value={hashFee + BASE_NETWORK_FEE_STX} decimals={4} suffix=" STX" />
            </span>
          </Tooltip>
        </div>
      </div>

      <p className="card-description">
        <HighlightText text="Store and verify SHA-256 hashes for files and data on the blockchain" query={searchQuery} />
      </p>

      <div className={twMerge("relative", isSubmitting && "pointer-events-none")}>
        <div className="form-group mb-6">
          <div className="flex flex-between items-center mb-2">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold">
              <label>SHA-256 Hash</label>
              <Tooltip content="A 64-character hexadecimal string representing a SHA-256 hash.">
                <div className="cursor-help opacity-40 hover:opacity-100 transition-opacity" role="note" aria-label="Hash format help">
                  <HelpCircle size={10} aria-hidden="true" />
                </div>
              </Tooltip>
            </div>
            <AnimatePresence>
              {hash.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  className="flex items-center gap-1"
                >
                  {isHashValid ? (
                    <span className="text-[10px] text-success font-bold flex items-center gap-1">
                      <CheckCircle2 size={10} /> Valid Hash
                    </span>
                  ) : (
                    <span className="text-[10px] text-destructive font-bold flex items-center gap-1">
                      <AlertCircle size={10} /> Invalid Length ({hash.length}/64)
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter 64-char hex hash..."
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={64}
                className={twMerge(
                  "input font-mono transition-all duration-200", 
                  isSubmitting && "opacity-50",
                  hash.length > 0 && isHashValid && "border-success/30 bg-success/5",
                  hash.length > 0 && !isHashValid && "border-destructive/30 bg-destructive/5"
                )}
                aria-label="SHA-256 hash to register"
                aria-required="true"
              />
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="*"
                aria-label="Upload file to hash"
              />
              <div className="h-full px-4 flex-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-bold text-muted-foreground whitespace-nowrap gap-2">
                <FileText size={14} />
                Hash File
              </div>
            </label>
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

      <SuccessMessage message="Hash registered!" txId={txId} />

      {!isConnected && <WarningMessage />}
    </motion.section>
  );
});

export default HashRegistry;
