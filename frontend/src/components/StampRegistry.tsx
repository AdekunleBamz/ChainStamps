import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { wcCallContract } from '../utils/walletconnect';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Stamp, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function StampRegistry() {
  const { isConnected, userAddress } = useWallet();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [txId, setTxId] = useState('');

  const stampMessage = async () => {
    if (!message || !isConnected || !userAddress) return;
    
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
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('error');
    }
  };

  return (
    <section id="stamp" className="card">
      <div className="card-header">
        <Stamp className="card-icon" />
        <h2>Stamp Registry</h2>
        <span className="fee-badge">0.05 STX</span>
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
      
      <button
        onClick={stampMessage}
        disabled={!message || !isConnected || status === 'submitting'}
        className="submit-btn"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="spin" size={18} />
            Stamping...
          </>
        ) : (
          'Stamp Message On-Chain'
        )}
      </button>
      
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
    </section>
  );
}
