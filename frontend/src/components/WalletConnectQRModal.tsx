import { X, Smartphone, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface WalletConnectQRModalProps {
  uri: string;
  onClose: () => void;
}

export function WalletConnectQRModal({ uri, onClose }: WalletConnectQRModalProps) {
  // Create a camera-friendly link for mobile users
  const mobileLink = `https://walletconnect.com/wc?uri=${encodeURIComponent(uri)}`;

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <h3>Connect Wallet</h3>
          <button className="qr-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
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
            <Smartphone size={18} />
            Scan with your Stacks wallet app
          </p>

          <p className="qr-subtext">
            Open <strong>Xverse</strong> or <strong>Leather</strong> mobile wallet and scan this QR code
          </p>

          <a
            href={mobileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="qr-mobile-link"
          >
            <ExternalLink size={16} />
            Open in wallet app (mobile)
          </a>
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
