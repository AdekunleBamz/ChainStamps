import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { wcCallContract } from '../utils/walletconnect';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { FileText, Hash, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function HashRegistry() {
  const { isConnected, userAddress } = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [hash, setHash] = useState('');
  const [status, setStatus] = useState<'idle' | 'hashing' | 'submitting' | 'success' | 'error'>('idle');
  const [txId, setTxId] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('hashing');
      
      const buffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHash(hashHex);
      setStatus('idle');
    }
  };

  const storeHash = async () => {
    if (!hash || !isConnected || !userAddress) return;
    
    setStatus('submitting');
    
    try {
      const result = await wcCallContract({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.hashRegistry.name,
        functionName: 'store-hash',
        functionArgs: [
          `0x${hash}`,
          description || 'Document hash',
        ],
        stxAmount: CONTRACTS.hashRegistry.fee,
      });
      
      setTxId(result.txid);
      setStatus('success');
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('error');
    }
  };

  return (
    <section id="hash" className="card">
      <div className="card-header">
        <Hash className="card-icon" />
        <h2>Hash Registry</h2>
        <span className="fee-badge">0.03 STX</span>
      </div>
      
      <p className="card-description">
        Store SHA-256 document hashes on-chain for permanent verification
      </p>
      
      <div className="form-group">
        <label className="file-input-label">
          <FileText size={20} />
          {file ? file.name : 'Choose a file to hash'}
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
        </label>
      </div>
      
      {hash && (
        <div className="hash-display">
          <label>SHA-256 Hash:</label>
          <code>{hash}</code>
        </div>
      )}
      
      <div className="form-group">
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={128}
          className="input"
        />
      </div>
      
      <button
        onClick={storeHash}
        disabled={!hash || !isConnected || status === 'submitting'}
        className="submit-btn"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="spin" size={18} />
            Storing...
          </>
        ) : status === 'hashing' ? (
          <>
            <Loader2 className="spin" size={18} />
            Hashing...
          </>
        ) : (
          'Store Hash On-Chain'
        )}
      </button>
      
      {status === 'success' && txId && (
        <div className="success-message">
          <CheckCircle size={18} />
          <span>Hash stored! </span>
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
          Connect your wallet to store hashes
        </div>
      )}
    </section>
  );
}
