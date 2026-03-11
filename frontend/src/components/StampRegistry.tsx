import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { wcCallContract } from '../utils/walletconnect';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Stamp, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { CardSkeleton } from './ui/Skeleton';
import { Tooltip } from './ui/Tooltip';
import { useToast } from '../context/ToastContext';
import { triggerSuccessConfetti } from '../utils/confetti';

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

    setStatus('submitting');

    try {
      const result = await wcCallContract({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.stampRegistry.name,
        functionName: 'stamp-message',
        functionArgs: [message],
        stxAmount: CONTRACTS.stampRegistry.fee,
      });

      setTxId(result.txid);
      setStatus('success');
      setMessage('');
      addToast('Message stamped successfully!', 'success');
      triggerSuccessConfetti();
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('error');
      addToast('Failed to stamp message. Please try again.', 'error');
    }
  };

  if (isLoading) return <CardSkeleton />;

  return (
    <motion.section id="stamp" className="card" animate={controls}>
      <div className="card-header">
        <Stamp className="card-icon" size={24} strokeWidth={1.5} />
        <h2>Stamp Registry</h2>
        <Tooltip content="Stacks network transaction fee (paid in STX)">
          <span className="fee-badge">0.05 STX</span>
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
    </motion.section>
  );
}
