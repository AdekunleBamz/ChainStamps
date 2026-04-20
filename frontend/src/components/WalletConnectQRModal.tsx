import { X, Smartphone, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

/** WalletConnect deep-link base URL for opening URIs in mobile wallets. */
const WALLETCONNECT_MOBILE_BASE = 'https://walletconnect.com/wc';
/** Side length in pixels for the QR code SVG. */
const QR_CODE_SIZE = 240;
/** QR code background colour. */
const QR_BG_COLOR = '#1a1a2e';
/** QR code foreground colour. */
const QR_FG_COLOR = '#ffffff';

interface WalletConnectQRModalProps {
  uri: string;
  onClose: () => void;
}

/**
 * Modal component for displaying a WalletConnect QR code.
 * 
 * @param {WalletConnectQRModalProps} props - Component properties.
 * @param {string} props.uri - The WalletConnect pairing URI.
 * @param {() => void} props.onClose - Callback when the modal is closed.
 */
export const WalletConnectQRModal = ({ uri, onClose }: WalletConnectQRModalProps) => {
  // Create a camera-friendly link for mobile users
  const mobileLink = `${WALLETCONNECT_MOBILE_BASE}?uri=${encodeURIComponent(uri)}`;

  return (
    <div className="qr-modal-overlay flex-center" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="qr-modal-title">
      <div className="qr-modal glass shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header flex-between mb-4">
          <h3 id="qr-modal-title">Connect Wallet</h3>
          <Button
            variant="ghost"
            size="icon"
            className="qr-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={1.5} />
          </Button>
        </div>

        <div className="qr-modal-content flex-center flex-col gap-4">
          <div className="qr-code-container shadow-md">
            <QRCodeSVG
              value={uri}
              size={QR_CODE_SIZE}
              bgColor={QR_BG_COLOR}
              fgColor={QR_FG_COLOR}
              level="M"
              includeMargin
            />
          </div>

          <p className="qr-instructions flex-center gap-2">
            <Smartphone size={18} strokeWidth={1.5} />
            Scan with your Stacks wallet app
          </p>

          <p className="qr-subtext text-center">
            Open <strong>Xverse</strong> or <strong>Leather</strong> mobile wallet and scan this QR code
          </p>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={mobileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="qr-mobile-link flex-center gap-2"
          >
            <ExternalLink size={16} strokeWidth={1.5} />
            Open in wallet app (mobile)
          </motion.a>
        </div>

        <div className="qr-modal-footer">
          <p>Don't have a wallet?</p>
          <div className="wallet-links">
            <a href="https://www.xverse.app/" target="_blank" rel="noopener noreferrer">
              Get Xverse
            </a>
            <a href="https://leather.io/" target="_blank" rel="noopener noreferrer">
              Get Leather
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
