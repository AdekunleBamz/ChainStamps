import { X, Smartphone, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

interface WalletConnectQRModalProps {
  uri: string;
  onClose: () => void;
}

export const WalletConnectQRModal = ({ uri, onClose }: WalletConnectQRModalProps) => {
  // Create a camera-friendly link for mobile users
  const mobileLink = `https://walletconnect.com/wc?uri=${encodeURIComponent(uri)}`;

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <h3>Connect Wallet</h3>
          <Button
            variant="ghost"
            size="icon"
            className="qr-close-btn"
            onClick={onClose}
          >
            <X size={20} strokeWidth={1.5} />
          </Button>
        </div>

        <div className="qr-modal-content">
          <div className="qr-code-container">
            <QRCodeSVG
              value={uri}
              size={240}
              bgColor="#1a1a2e"
              fgColor="#ffffff"
              level="M"
              includeMargin
            />
          </div>

          <p className="qr-instructions">
            <Smartphone size={18} strokeWidth={1.5} />
            Scan with your Stacks wallet app
          </p>

          <p className="qr-subtext">
            Open <strong>Xverse</strong> or <strong>Leather</strong> mobile wallet and scan this QR code
          </p>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={mobileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="qr-mobile-link"
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
