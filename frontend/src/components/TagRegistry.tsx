import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';
import { Tag, Share2, Shield, Info, ExternalLink } from 'lucide-react';
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
import { RecentActivity } from './ui/RecentActivity';

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

import { HighlightText } from './ui/HighlightText';

/**
 * TagRegistry component for managing decentralized key-value metadata.
 */
export const TagRegistry = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { isConnected, userAddress } = useWallet();
  const { addToast } = useToast();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  const { isSubmitting, txId, execute, history } = useContractCall();

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
      }, 'Tag stored successfully!', `Tag: ${key}`);
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
      <div className="card-header flex-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Tag className="card-icon text-primary" size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold m-0 p-0 leading-none">
              <HighlightText text="Tag Registry" query={searchQuery} />
            </h2>
            <Tooltip content="Tags allow you to attach metadata to Stacks namespaces, facilitating decentralized discovery and organization.">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Namespace Metadata</span>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip content="View contract on Stacks Explorer">
            <a
              href={`https://explorer.stacks.co/txid/${CONTRACT_ADDRESS}.${CONTRACTS.tagRegistry.name}?chain=mainnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 flex-center rounded-full opacity-40 hover:opacity-100 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
              aria-label="View contract on Stacks Explorer"
            >
              <ExternalLink size={16} strokeWidth={1.5} />
            </a>
          </Tooltip>
          <Tooltip content="Copy link to this section">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-40 hover:opacity-100 hover:bg-primary/10 transition-all"
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
          <Tooltip 
            content={
              <div className="flex flex-col gap-1 p-1">
                <div className="flex-between gap-4">
                  <span>Base Network Fee:</span>
                  <span className="font-mono">0.0010 STX</span>
                </div>
                <div className="flex-between gap-4">
                  <span>Metadata Storage:</span>
                  <span className="font-mono">{(estimateFee(key + value) - 0.001).toFixed(4)} STX</span>
                </div>
                <div className="border-t border-white/10 mt-1 pt-1 flex-between gap-4 font-bold text-primary">
                  <span>Total Estimated:</span>
                  <span className="font-mono">{(estimateFee(key + value)).toFixed(4)} STX</span>
                </div>
              </div>
            }
          >
            <span className="fee-badge bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
              <AnimatedNumber value={estimateFee(key + value)} decimals={4} suffix=" STX" />
            </span>
          </Tooltip>
        </div>
      </div>

      <p className="card-description">
        <HighlightText text="Store key-value pairs permanently on the blockchain" query={searchQuery} />
      </p>

      <div className={twMerge("relative", isSubmitting && "pointer-events-none")}>
        <div className="form-group mb-4">
          <div className="flex items-center gap-2 mb-1">
            <label className="text-[10px] text-muted-foreground uppercase font-bold">Key Name</label>
            <Tooltip content="Keys are automatically formatted as kebab-case (e.g., 'my-tag-name')">
              <Info size={10} className="text-muted-foreground/50 cursor-help" />
            </Tooltip>
          </div>
          <input
            type="text"
            placeholder="e.g., 'project-name'"
            value={key}
            onChange={(e) => setKey(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
            onKeyDown={handleKeyDown}
            maxLength={64}
            className={twMerge("input font-mono", isSubmitting && "opacity-50")}
            aria-label="Tag key name"
            aria-required="true"
          />
          <span className="char-count text-[10px] mt-1 block text-right text-muted-foreground/40">{key.length}/64</span>
        </div>

        <div className="form-group mb-6">
          <label className="text-[10px] text-muted-foreground uppercase font-bold mb-1 block">Value Content</label>
          <textarea
            placeholder="e.g., 'ChainStamp v1.0'"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={256}
            rows={3}
            className={twMerge("textarea resize-none", isSubmitting && "opacity-50")}
            aria-label="Tag value content"
            aria-required="true"
          />
          <div className="flex-between items-start mt-1">
            {value.length >= 220 && (
              <span className="text-[10px] text-orange-500 font-bold flex items-center gap-1">
                <Shield size={10} /> Data limit approaching
              </span>
            )}
            <span className="char-count text-[10px] ml-auto text-muted-foreground/40" aria-live="polite">{value.length}/256</span>
          </div>
        </div>

        {isSubmitting && (
          <div className="absolute inset-0 z-10 flex-center bg-background/20 backdrop-blur-[1px] rounded-2xl pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-lg"
            >
              Confirm in Wallet
            </motion.div>
          </div>
        )}
      </div>

      <SubmitButton
        onClick={storeTag}
        isLoading={isSubmitting}
        disabled={!key || !value || !isConnected}
        loadingText="Storing..."
        idleText="Store Tag On-Chain"
        ariaBusy={isSubmitting}
      />

      <RecentActivity 
        activities={history.filter(a => a.type === 'tag')} 
        className="mt-6 pt-6 border-t border-white/5"
      />

      <SuccessMessage message="Tag stored!" txId={txId} />

      {!isConnected && <WarningMessage />}
    </motion.section>
  );
}
