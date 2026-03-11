import { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { ChainStampsService } from '../services/api';
import { Stamp, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';
import { RegistryLayout } from './RegistryLayout';

export function StampRegistry() {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [txId, setTxId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
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

    setStatus('submitting');

    try {
      const result = await ChainStampsService.stampMessage(message);

      setTxId(result.txid);
      setStatus('success');
      setMessage('');
      addToast('Message stamped successfully!', 'success');
      triggerSuccessConfetti();
    } catch (error: any) {
      console.error('Transaction failed:', error);
      setStatus('error');
      addToast(error.message || 'Failed to stamp message. Please try again.', 'error');
    }
  }, [message, isConnected, userAddress, addToast, shake]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (message && isConnected && status !== 'submitting') {
        stampMessage();
      }
    }
  }, [message, isConnected, status, stampMessage]);

  if (isLoading) return <CardSkeleton />;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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

      <Button
        onClick={stampMessage}
        disabled={!message || !isConnected || status === 'submitting'}
        variant="primary"
        size="lg"
        className="submit-btn w-full"
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
        <div className="success-message">
          <CheckCircle size={18} />
          <span>Message stamped! </span>
          <a
            href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View transaction
          </a>
        </div>
      )}

      {!isConnected && (
        <div className="warning-message">
          <AlertCircle size={18} />
          Connect your wallet to stamp messages
        </div>
      )}
    </RegistryLayout>
  );
  );
}
