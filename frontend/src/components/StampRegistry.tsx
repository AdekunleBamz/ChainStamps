import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Stamp, Share2 } from 'lucide-react';
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

const SHAKE_ANIMATION = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
};

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
  const { isSubmitting, txId, execute } = useContractCall();

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
      }, 'Message stamped successfully!');
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
          <Tooltip content="Stacks network transaction fee (paid in STX) to secure your message on the Bitcoin blockchain.">
            <span className="fee-badge bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
              <AnimatedNumber value={estimateFee(message)} decimals={4} suffix=" STX" />
            </span>
          </Tooltip>
        </div>
      </div>

      <p className="card-description">
        Permanently stamp messages on the Stacks blockchain with timestamps
      </p>

      <div className="form-group">
        <textarea
          placeholder="Enter your message to stamp on-chain..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={256}
          rows={4}
          className="textarea"
          aria-label="Message to be stamped on the Stacks blockchain"
          aria-required="true"
        />
        <span className="char-count" aria-live="polite">{message.length}/256</span>
      </div>

      <SubmitButton
        onClick={storeStamp}
        isLoading={isSubmitting}
        disabled={!message || !isConnected}
        loadingText="Stamping..."
        idleText="Stamp Message On-Chain"
        ariaBusy={isSubmitting}
      />

      <SuccessMessage message="Message stamped!" txId={txId} />

      {!isConnected && <WarningMessage />}
    </motion.section>
  );
}
