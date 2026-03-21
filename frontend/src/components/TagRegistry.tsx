import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { wcCallContract } from '../utils/walletconnect';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Tag, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';

/**
 * A registry component for storing and managing key-value tags on the Stacks blockchain.
 * 
 * @returns {JSX.Element} The rendered tag registry component.
 */
export const TagRegistry = () => {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [txId, setTxId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

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

    setStatus('submitting');

    try {
      const result = await wcCallContract({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.tagRegistry.name,
        functionName: 'store-tag',
        functionArgs: [key, value],
        stxAmount: CONTRACTS.tagRegistry.fee,
      });

      setTxId(result.txid);
      setStatus('success');
      setKey('');
      setValue('');
      addToast('Tag stored successfully!', 'success');
      triggerSuccessConfetti();
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('error');
      addToast('Failed to store tag. Please try again.', 'error');
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
      <div className="card-header">
        <Tag className="card-icon" size={24} strokeWidth={1.5} />
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
    </motion.section>
  );
}
