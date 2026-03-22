import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { wcCallContract } from '../utils/walletconnect';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Stamp, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';

/**
 * StampRegistry component for anchoring short messages and timestamps to the Stacks blockchain.
 * Ideal for:
 * - Proof of existence for short messages
 * - Time-stamping critical data points
 * - Permanent record keeping on the Bitcoin layer
 */
export const StampRegistry = () => {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [message, setMessage] = useState('');
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

  const stampMessage = async () => {
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
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (message && isConnected && !isSubmitting) {
        stampMessage();
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
      <div className="card-header flex-between mb-2">
        <div className="flex items-center gap-2">
          <Stamp className="card-icon" size={24} strokeWidth={1.5} />
        </div>
        <h2>Stamp Registry</h2>
        <Tooltip content="Stacks network transaction fee (paid in STX)">
          <span className="fee-badge">
            <AnimatedNumber value={0.05} decimals={2} suffix=" STX" />
          </span>
        </Tooltip>
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

      <Button
        onClick={stampMessage}
        disabled={!message || !isConnected || status === 'submitting'}
        aria-busy={status === 'submitting'}
        variant="primary"
        size="lg"
        className="submit-btn w-full flex-center"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="spinning mr-2" size={18} strokeWidth={1.5} />
            Stamping...
          </>
        ) : (
          'Stamp Message On-Chain'
        )}
      </Button>

      {status === 'success' && txId && (
        <div className="success-message flex-center gap-2" role="status" aria-live="polite">
          <CheckCircle size={18} />
          <span>Message stamped! </span>
          <a
            href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View stamped message transaction on Stacks Explorer"
          >
            View transaction
          </a>
        </div>
      )}

      {!isConnected && (
        <div className="warning-message flex-center gap-2">
          <AlertCircle size={18} />
          Connect your wallet to stamp messages
        </div>
      )}
    </motion.section>
  );
}
