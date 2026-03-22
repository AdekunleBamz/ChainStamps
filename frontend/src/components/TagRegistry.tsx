import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Tag } from 'lucide-react';
import { Button } from './ui/Button';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';

/**
 * TagRegistry component for managing key-value metadata on the Stacks blockchain.
 * Features:
 * - Arbitrary key-value pair storage
 * - Real-time character count tracking
 * - Transaction feedback with explorer integration
 * - Stacks wallet authentication integration
 */
import { useContractCall } from '../hooks/useContractCall';

export const TagRegistry = () => {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  const { isSubmitting, txId, execute } = useContractCall();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const shake = async () => {
    await controls.start({
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    });
  };

  const storeTag = async () => {
    if (!key || !value || !isConnected || !userAddress) {
      if (!key || !value) {
        addToast('Please enter both key and value for the tag.', 'warning');
        shake();
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
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (key && value && isConnected && status !== 'submitting') {
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
        </div>
        <h2>Tag Registry</h2>
        <Tooltip content="Stacks network transaction fee (paid in STX)">
          <span className="fee-badge">
            <AnimatedNumber value={0.04} decimals={2} suffix=" STX" />
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
