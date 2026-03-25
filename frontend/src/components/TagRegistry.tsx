import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Tag, Share2 } from 'lucide-react';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { Button } from './ui/Button';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { SuccessMessage } from './ui/SuccessMessage';
import { WarningMessage } from './ui/WarningMessage';
import { SubmitButton } from './ui/SubmitButton';
import { useToast } from '../context/ToastContext';

/**
 * TagRegistry component for managing key-value metadata on the Stacks blockchain.
 * Features:
 * - Arbitrary key-value pair storage
 * - Real-time character count tracking
 * - Transaction feedback with explorer integration
 * - Stacks wallet authentication integration
 */
import { useContractCall } from '../hooks/useContractCall';
import { triggerHaptic } from '../utils/haptics';
import { estimateFee } from '../utils/fee';

const SHAKE_ANIMATION = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
};

export const TagRegistry = () => {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  const { isSubmitting, txId, execute } = useContractCall();

  const handleError = (msg: string) => {
    addToast(msg, 'error');
    controls.start(SHAKE_ANIMATION);
    triggerHaptic('error');
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Finalizes the dynamic tag storage process by executing the 'store-tag'
   * contract call on the Stacks blockchain.
   */
  const storeTag = async () => {
    if (!key || !value || !isConnected || !userAddress) {
      if (!key || !value) {
        handleError('Please enter both key and value for the tag.');
      }
      return;
    }

    try {
      await execute({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.tagRegistry.name,
        functionName: 'store-tag',
        functionArgs: [key, value],
        stxAmount: CONTRACTS.tagRegistry.fee,
      }, 'Tag stored successfully!');
      setKey('');
      setValue('');
    } catch {
      // Error handled by hook
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (key && value && isConnected && !isSubmitting) {
        storeTag();
      }
    }
  };

  if (isLoading) return <CardSkeleton />;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section
      id="tag"
      className="card"
      variants={cardVariants}
      initial="initial"
      animate={controls}
    >
      <Breadcrumbs items={[{ label: 'Tag Registry' }]} />
      <div className="card-header flex-between mb-2">
        <div className="flex items-center gap-2">
          <Tag className="card-icon" size={24} strokeWidth={1.5} />
          <Tooltip content="Tags allow you to attach metadata to Stacks namespaces, facilitating decentralized discovery and organization.">
            <span className="text-sm font-semibold text-muted-foreground mr-1">Namespace Metadata</span>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="m-0">Tag Registry</h2>
          <Tooltip content="Copy link to this section">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-50 hover:opacity-100 transition-opacity"
              onClick={() => {
                const url = new URL(window.location.href);
                url.hash = 'tag';
                navigator.clipboard.writeText(url.toString());
                addToast('Section link copied!', 'success');
                triggerHaptic('success');
              }}
              aria-label="Copy link to Tag Registry section"
            >
              <Share2 size={16} strokeWidth={1.5} />
            </Button>
          </Tooltip>
        </div>
        <Tooltip content="Stacks network transaction fee (paid in STX) to update your namespace metadata.">
          <span className="fee-badge">
            <AnimatedNumber value={estimateFee(key + value)} decimals={4} suffix=" STX" />
          </span>
        </Tooltip>
      </div>

      <p className="card-description">
        Store key-value pairs permanently on the blockchain
      </p>

      <div className="form-group">
        <input
          type="text"
          placeholder="Key (e.g., 'project-name')"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={64}
          className="input"
          aria-label="Tag key name"
          aria-required="true"
        />
        <span className="char-count" aria-live="polite">{key.length}/64</span>
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
          aria-label="Tag value content"
          aria-required="true"
        />
        <span className="char-count" aria-live="polite">{value.length}/256</span>
      </div>

      <SubmitButton
        onClick={storeTag}
        isLoading={isSubmitting}
        disabled={!key || !value || !isConnected}
        loadingText="Storing..."
        idleText="Store Tag On-Chain"
        ariaBusy={isSubmitting}
      />

      <SuccessMessage message="Tag stored!" txId={txId} />

      {!isConnected && <WarningMessage />}
    </motion.section>
  );
}
