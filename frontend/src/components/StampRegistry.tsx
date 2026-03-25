import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Stamp, Share2, Shield, ExternalLink } from 'lucide-react';
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
import { estimateFee } from '../utils/fee';
import { RecentActivity } from './ui/RecentActivity';

const SHAKE_ANIMATION = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
};

/**
 * StampRegistry component for permanently recording text messages on the Stacks blockchain.
 * Supports:
 * - Immutable message stamping with Stacks network timestamps
 * - Character count validation (256 chars max)
 * - Real-time fee estimation based on message weight
 * - Integration with Stacks Explorer for verification
 */
export const StampRegistry = () => {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  /**
   * Registry configuration for the Stamp features.
   * Lists all available stamp-based contracts and their metadata.
   */
  const controls = useAnimation();
  const { isSubmitting, txId, execute, history } = useContractCall();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Triggers a visual 'shake' animation on the card to indicate validation errors.
   */
  const shake = () => {
    controls.start(SHAKE_ANIMATION);
    triggerHaptic('error');
  };

  /**
   * Finalizes the message stamping process by executing the 'store-stamp'
   * contract call on the Stacks blockchain.
   */
  const storeStamp = async () => {
    if (!message || !isConnected || !userAddress) {
      if (!message) {
        addToast('Please enter a message to stamp.', 'warning');
        shake();
      }
      return;
    }

    try {
      await execute({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.stampRegistry.name,
        functionName: 'stamp-message',
        functionArgs: [message],
        stxAmount: CONTRACTS.stampRegistry.fee,
      }, 'Message stamped successfully!', message.slice(0, 32) + (message.length > 32 ? '...' : ''));
      setMessage('');
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
            <h2 className="text-xl font-bold m-0 p-0 leading-none">Stamp Registry</h2>
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
                  <span className="font-mono">0.0010 STX</span>
                </div>
                <div className="flex-between gap-4">
                  <span>Message Storage:</span>
                  <span className="font-mono">{(estimateFee(message) - 0.001).toFixed(4)} STX</span>
                </div>
                <div className="border-t border-white/10 mt-1 pt-1 flex-between gap-4 font-bold text-primary">
                  <span>Total Estimated:</span>
                  <span className="font-mono">{(estimateFee(message)).toFixed(4)} STX</span>
                </div>
              </div>
            }
          >
            <span className="fee-badge bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
              <AnimatedNumber value={estimateFee(message)} decimals={4} suffix=" STX" />
            </span>
          </Tooltip>
        </div>
      </div>

      <p className="card-description">
        Permanently stamp messages on the Stacks blockchain with timestamps
      </p>

      <div className={twMerge("relative", isSubmitting && "pointer-events-none")}>
        <div className="form-group mb-6">
          <textarea
            placeholder="Enter your message to stamp on-chain..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={handleKeyDown}
            maxLength={256}
            rows={4}
            className={twMerge(
              "textarea min-h-[120px] transition-all duration-200 resize-none",
              isSubmitting && "opacity-50"
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
            {message.length}/256
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
}
