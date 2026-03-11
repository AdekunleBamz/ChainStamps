import { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
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
import { triggerSuccessConfetti } from '../utils/confetti';
import { RegistryLayout } from './RegistryLayout';

/** Shake animation variant for form validation errors. */
const SHAKE_ANIMATION = ANIMATIONS.SHAKE;

/** Rate limit interval for stamp submission in milliseconds. */
const RATE_LIMIT_INTERVAL = UI.RATE_LIMIT_COOLDOWN;

/** Maximum message length for stamp registry. */
const MAX_MESSAGE_LENGTH = 256;

/** Minimum message length for valid stamp. */
const MIN_MESSAGE_LENGTH = 1;

/** Number of characters to show in stamp activity preview. */
const STAMP_PREVIEW_LENGTH = 32;

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
    const timer = setTimeout(() => setIsLoading(false), UI.SKELETON_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const shake = useCallback(async () => {
    await controls.start({
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    });
  }, [controls]);

  const stampMessage = useCallback(async () => {
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
      }, 'Message stamped successfully!', sanitizedMessage.slice(0, STAMP_PREVIEW_LENGTH) + (sanitizedMessage.length > STAMP_PREVIEW_LENGTH ? '...' : ''));
      setMessage('');
      setLastSubmitTime(Date.now());
    } catch {
      // Error handled by hook
    }
  }, [message, isConnected, userAddress, addToast, shake]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (message && isConnected && !isSubmitting) {
        storeStamp();
      }
    }
  }, [message, isConnected, status, stampMessage]);

  if (isLoading) return <CardSkeleton />;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const isMessageValid = message.length > 0 && message.length <= MAX_MESSAGE_LENGTH;

  return (
    <RegistryLayout
      id="stamp"
      title="Stamp Registry"
      description="Permanently stamp messages on the Stacks blockchain with timestamps"
      icon={Stamp}
      controls={controls}
      fee={{ value: 0.05, unit: "STX", tooltip: "Stacks network transaction fee (paid in STX)" }}
    >
      <div className="form-group">
        <textarea
          placeholder="Enter your message to stamp on-chain..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={256}
          rows={4}
          className="textarea"
        />
        <span className="char-count">{message.length}/256</span>
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

      {!isConnected && (
        <div className="warning-message">
          <AlertCircle size={18} />
          Connect your wallet to stamp messages
        </div>
      )}
    </RegistryLayout>
  );
  );
});

export default StampRegistry;
