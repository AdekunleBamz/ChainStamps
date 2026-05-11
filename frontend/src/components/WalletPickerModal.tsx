import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

interface WalletPickerModalProps {
  onSelectHiro: () => void;
  onSelectWalletConnect: () => void;
  onClose: () => void;
}

/**
 * Modal component for choosing a wallet connection method.
 * Offers Hiro Wallet / Leather (browser extension) or WalletConnect (mobile QR).
 * Closes on backdrop click; keyboard focus should be trapped while open.
 */
export const WalletPickerModal = ({ onSelectHiro, onSelectWalletConnect, onClose }: WalletPickerModalProps) => {
  return (
    <div
      className="qr-modal-overlay flex-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-picker-title"
    >
      <motion.div
        className="qr-modal glass shadow-lg"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        <div className="qr-modal-header flex-between mb-4">
          <h3 id="wallet-picker-title" style={{ margin: 0 }}>Connect a Wallet</h3>
          <Button variant="ghost" size="icon" className="qr-close-btn" onClick={onClose} aria-label="Close wallet picker">
            <X size={18} />
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '8px' }}>
          <button
            onClick={onSelectHiro}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', borderRadius: 10,
              background: 'var(--primary, #6c63ff)', color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, width: '100%',
              transition: 'opacity 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <rect width="24" height="24" rx="6" fill="white" fillOpacity=".2"/>
              <path d="M12 4L5 8.5V15.5L12 20L19 15.5V8.5L12 4Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="12" cy="12" r="2.5" fill="white"/>
            </svg>
            Hiro Wallet / Leather
          </button>

          <button
            onClick={onSelectWalletConnect}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.07)', color: 'var(--foreground, #fff)',
              border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', fontSize: 15, fontWeight: 600, width: '100%',
              transition: 'background 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <rect width="24" height="24" rx="6" fill="white" fillOpacity=".08"/>
              <path d="M7 9.5C9.5 7 14.5 7 17 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9 12C10.5 10.5 13.5 10.5 15 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="14.5" r="1.5" fill="white"/>
            </svg>
            WalletConnect (Mobile / QR)
          </button>
        </div>
      </motion.div>
    </div>
  );
};
