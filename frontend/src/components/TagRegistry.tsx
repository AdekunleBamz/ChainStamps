import { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { BASE_NETWORK_FEE_STX, CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Tag, Share2, Shield, ExternalLink, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { Button } from './ui/Button';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { SuccessMessage } from './ui/SuccessMessage';
import { WarningMessage } from './ui/WarningMessage';
import { SubmitButton } from './ui/SubmitButton';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';
import { RegistryLayout } from './RegistryLayout';

/** Shake animation variant for form validation errors. */
const SHAKE_ANIMATION = ANIMATIONS.SHAKE;

/** Rate limit interval for tag submission in milliseconds. */
const RATE_LIMIT_INTERVAL = UI.RATE_LIMIT_COOLDOWN;

/** Maximum key length for tag registry. */
const MAX_KEY_LENGTH = 64;

/** Maximum value length for tag registry. */
const MAX_VALUE_LENGTH = 256;

/** Regular expression pattern for validating tag key format (kebab-case). */
const TAG_KEY_PATTERN = /^[a-z0-9-]+$/;

/**
 * TagRegistry component for managing decentralized key-value metadata.
 */
export const TagRegistry = memo(({ searchQuery = '' }: { searchQuery?: string }) => {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();
  const { isSubmitting, step, txId, execute, history } = useContractCall();
  const { fees } = useOnChainFees();
  const tagFee = fees.tag;

  const handleError = (msg: string) => {
    addToast(msg, 'error');
    controls.start(SHAKE_ANIMATION);
    triggerHaptic('error');
  };

  const [lastSubmitTime, setLastSubmitTime] = useState(0);

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

  const storeTag = useCallback(async () => {
    if (!key || !value || !isConnected || !userAddress) {
      if (!key || !value) {
        handleError('Please enter both key and value for the tag.');
      }
      return;
    }

    try {
      const sanitizedKey = key.trim();
      const sanitizedValue = value.trim();
      await execute({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.tagRegistry.name,
        functionName: 'store-tag',
        functionArgs: [
          cvToHex(stringUtf8CV(sanitizedKey)),
          cvToHex(stringUtf8CV(sanitizedValue)),
        ],
      }, 'Tag stored successfully!', `Tag: ${sanitizedKey}`);
      setKey('');
      setValue('');
      setLastSubmitTime(Date.now());
    } catch {
      // Error handled by hook
    }
  }, [key, value, isConnected, userAddress, addToast, shake]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (key && value && isConnected && !isSubmitting) {
        storeTag();
      }
    }
  }, [key, value, isConnected, status, storeTag]);

  if (isLoading) return <CardSkeleton />;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const isKeyValid = key.length > 0 && TAG_KEY_PATTERN.test(key);
  const isValueValid = value.length > 0 && value.length <= MAX_VALUE_LENGTH;

  return (
    <RegistryLayout
      id="tag"
      title="Tag Registry"
      description="Store key-value pairs permanently on the blockchain"
      icon={Tag}
      controls={controls}
      fee={{ value: 0.04, unit: "STX", tooltip: "Stacks network transaction fee (paid in STX)" }}
    >
      <div className="form-group">
        <input
          type="text"
          placeholder="Key (e.g., 'project-name')"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={64}
          className="input"
        />
        <span className="char-count">{key.length}/64</span>
      </div>

      <div className="form-group">
        <textarea
          placeholder="Value (e.g., 'ChainStamp v1.0')"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={256}
          rows={3}
          className="textarea"
        />
        <span className="char-count">{value.length}/256</span>
      </div>

      <Button
        onClick={storeTag}
        disabled={!key || !value || !isConnected || status === 'submitting'}
        variant="primary"
        size="lg"
        className="submit-btn w-full"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="spinning mr-2" size={18} strokeWidth={1.5} />
            Storing...
          </>
        ) : (
          'Store Tag On-Chain'
        )}
      </Button>

      {status === 'success' && txId && (
        <div className="success-message">
          <CheckCircle size={18} />
          <span>Tag stored! </span>
          <a
            href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View transaction
          </a>
        </div>
      )}

      {
        !isConnected && (
          <div className="warning-message">
            <AlertCircle size={18} />
            Connect your wallet to store tags
          </div>
        )
      }
    </RegistryLayout>
  );
  );
});

export default TagRegistry;
