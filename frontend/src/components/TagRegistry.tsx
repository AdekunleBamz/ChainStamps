import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { wcCallContract } from '../utils/walletconnect';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Tag, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function TagRegistry() {
  const { isConnected, userAddress } = useWallet();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [txId, setTxId] = useState('');

  const storeTag = async () => {
    if (!key || !value || !isConnected || !userAddress) return;
    
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
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('error');
    }
  };

  return (
    <section id="tag" className="card">
      <div className="card-header">
        <Tag className="card-icon" />
        <h2>Tag Registry</h2>
        <span className="fee-badge">0.04 STX</span>
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
          maxLength={256}
          rows={3}
          className="textarea"
        />
        <span className="char-count">{value.length}/256</span>
      </div>
      
      <button
        onClick={storeTag}
        disabled={!key || !value || !isConnected || status === 'submitting'}
        className="submit-btn"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="spin" size={18} />
            Storing...
          </>
        ) : (
          'Store Tag On-Chain'
        )}
      </button>
      
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
      
      {!isConnected && (
        <div className="warning-message">
          <AlertCircle size={18} />
          Connect your wallet to store tags
        </div>
      )}
    </section>
  );
}
