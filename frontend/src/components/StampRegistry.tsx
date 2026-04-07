import { useState, useEffect, memo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { BASE_NETWORK_FEE_STX, CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Stamp, Share2, Shield, ExternalLink, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { Button } from './ui/Button';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { useToast } from '../context/ToastContext';
import { useContractCall } from '../hooks/useContractCall';
import { SuccessMessage } from './ui/SuccessMessage';
import { WarningMessage } from './ui/WarningMessage';
import { SubmitButton } from './ui/SubmitButton';
import { triggerHaptic } from '../utils/haptics';
import { RecentActivity } from './ui/RecentActivity';
import { HighlightText } from './ui/HighlightText';
import { TransactionStepper } from './ui/TransactionStepper';
import { cvToHex, stringUtf8CV } from '@stacks/transactions';
import { useOnChainFees } from '../hooks/useOnChainFees';

/** Shake animation variant for form validation errors. */
const SHAKE_ANIMATION = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
};

/** Rate limit interval for stamp submission in milliseconds. */
const RATE_LIMIT_INTERVAL = 2000;

/** Maximum message length for stamp registry. */
const MAX_MESSAGE_LENGTH = 256;

/** Minimum message length for valid stamp. */
const MIN_MESSAGE_LENGTH = 1;

/**
 * StampRegistry component for permanently recording text messages on the Stacks blockchain.
 */
export const StampRegistry = memo(({ searchQuery = '' }: { searchQuery?: string }) => {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();
  const { isSubmitting, step, txId, execute, history } = useContractCall();
  const { fees } = useOnChainFees();
  const stampFee = fees.stamp;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const shake = () => {
    controls.start(SHAKE_ANIMATION);
    triggerHaptic('error');
  };

  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const storeStamp = async () => {
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_INTERVAL) return;

    if (!message || !isConnected || !userAddress) {
      if (!message) {
        addToast('Please enter a message to stamp.', 'warning');
        shake();
      }
      return;
    }

    try {
      const sanitizedMessage = message.trim();
      await execute({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.stampRegistry.name,
        functionName: 'stamp-message',
        functionArgs: [cvToHex(stringUtf8CV(sanitizedMessage))],
      }, 'Message stamped successfully!', sanitizedMessage.slice(0, 32) + (sanitizedMessage.length > 32 ? '...' : ''));
      setMessage('');
      setLastSubmitTime(Date.now());
    } catch {
      // Error handled by hook
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (message && isConnected && !isSubmitting) {
        storeStamp();
      }
    }
  };

  if (isLoading) return <CardSkeleton />;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const isMessageValid = message.length > 0 && message.length <= MAX_MESSAGE_LENGTH;

  return (
    <motion.section
      id="stamp"
      className="card"
      variants={cardVariants}
      initial="initial"
      animate={controls}
    >
      <Breadcrumbs items={[{ label: 'Stamp Registry' }]} />
      <div className="card-header flex-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Stamp className="card-icon text-primary" size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold m-0 p-0 leading-none">
              <HighlightText text="Stamp Registry" query={searchQuery} />
            </h2>
            <Tooltip content="A message stamp permanently records your text and a timestamp on the blockchain, creating an immutable proof of existence.">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Proof of Existence</span>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip content="View contract on Stacks Explorer">
            <a
              href={`https://explorer.stacks.co/txid/${CONTRACT_ADDRESS}.${CONTRACTS.stampRegistry.name}?chain=mainnet`}
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
                url.hash = 'stamp';
                navigator.clipboard.writeText(url.toString());
                addToast('Section link copied!', 'success');
                triggerHaptic('success');
              }}
              aria-label="Copy link to Stamp Registry section"
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
                  <span>Contract Fee:</span>
                  <span className="font-mono">{stampFee.toFixed(4)} STX</span>
                </div>
                <div className="border-t border-white/10 mt-1 pt-1 flex-between gap-4 font-bold text-primary">
                  <span>Total Due:</span>
                  <span className="font-mono">{(stampFee + BASE_NETWORK_FEE_STX).toFixed(4)} STX</span>
                </div>
              </div>
            }
            aria-label="Fee breakdown for stamp registration"
          >
            <span className="fee-badge bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
              <AnimatedNumber value={stampFee + BASE_NETWORK_FEE_STX} decimals={4} suffix=" STX" />
            </span>
          </Tooltip>
        </div>
      </div>

      <p className="card-description">
        <HighlightText text="Permanently stamp messages on the Stacks blockchain with timestamps" query={searchQuery} />
      </p>

      <div className={twMerge("relative", isSubmitting && "pointer-events-none")}>
        <div className="form-group mb-6">
          <div className="flex flex-between items-center mb-2">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold">
              <label>Message Content</label>
              <Tooltip content="Maximum 256 characters. This message will be stored in the transaction metadata.">
                <div className="cursor-help opacity-40 hover:opacity-100 transition-opacity">
                  <HelpCircle size={10} />
                </div>
              </Tooltip>
            </div>
            <AnimatePresence>
              {message.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  className="flex items-center gap-1"
                >
                  {isMessageValid ? (
                    <span className="text-[10px] text-success font-bold flex items-center gap-1">
                      <CheckCircle2 size={10} /> Valid
                    </span>
                  ) : (
                    <span className="text-[10px] text-destructive font-bold flex items-center gap-1">
                      <AlertCircle size={10} /> Too long
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <textarea
            placeholder="Enter your message to stamp on-chain..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={handleKeyDown}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={4}
            className={twMerge(
              "textarea min-h-[120px] transition-all duration-200 resize-none",
              isSubmitting && "opacity-50",
              message.length > 0 && isMessageValid && "border-success/30 bg-success/5",
              message.length > 256 && "border-destructive/30 bg-destructive/5"
            )}
            style={{ height: 'auto' }}
            aria-label="Message to be stamped on the Stacks blockchain"
            aria-required="true"
          />
          <span 
            className={twMerge(
              "char-count text-[10px] mt-2 block text-right font-bold uppercase tracking-wider",
              message.length >= 256 ? "text-destructive" : message.length >= 230 ? "text-orange-500" : "text-muted-foreground/40"
            )} 
            aria-live="polite"
          >
            {message.length}/{MAX_MESSAGE_LENGTH}
          </span>
          {message.length >= 200 && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-[10px] text-orange-500 font-bold mt-2 flex items-center gap-1"
            >
              <Shield size={10} /> Approaching character limit for transaction data
            </motion.p>
          )}
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
        onClick={storeStamp}
        isLoading={isSubmitting}
        disabled={!message || !isConnected}
        loadingText="Stamping..."
        idleText="Stamp Message On-Chain"
        ariaBusy={isSubmitting}
      />

      <RecentActivity 
        activities={history.filter(a => a.type === 'stamp')} 
        className="mt-6 pt-6 border-t border-white/5"
      />

      <SuccessMessage message="Message stamped!" txId={txId} />

      {!isConnected && <WarningMessage />}
    </motion.section>
  );
});

export default StampRegistry;
