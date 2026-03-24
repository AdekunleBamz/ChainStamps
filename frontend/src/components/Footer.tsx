import { Github, Twitter, Globe, Zap, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { CONTRACT_ADDRESS, NETWORK } from '../config/contracts';

/**
 * Global Footer component.
 * Displays copyright information, social links, and site-wide navigation landmarks.
 * Optimized with React.memo to prevent unnecessary re-renders.
 * 
 * @component
 */
export const Footer = memo(() => {
  return (
    <footer className="footer" aria-label="Site Footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-brand flex-center" aria-label="ChainStamps Branding">
          <img src="/logo.png" alt="ChainStamps Logo" className="logo-img" aria-label="ChainStamps Brand Logo" />
          <span>ChainStamps</span>
        </div>

        <p className="footer-tagline">
          Permanent on-chain verification on Bitcoin's most secure layer
        </p>

        <div className="footer-metrics">
          <div className="metrics-title flex-center gap-2" aria-label="System Performance Heartbeat">
            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
            <span>Live System Metrics</span>
          </div>
          <div className="metrics-grid">
            <div className="metric-item" aria-label="Average Block Time: approximately 10 minutes">
              <Clock size={16} className="text-muted-foreground" />
              <div className="metric-info">
                <span className="metric-label">Avg. Block Time</span>
                <span className="metric-value">~10 min</span>
              </div>
            </div>
            <div className="metric-item" aria-label="Network Status: Operational">
              <ShieldCheck size={16} className="text-muted-foreground" />
              <div className="metric-info">
                <span className="metric-label">Network Status</span>
                <span className="metric-value text-green-500">Operational</span>
              </div>
            </div>
            <div className="metric-item" aria-label="Transactions Per Second: current active rate is 0.45">
              <Zap size={16} className="text-muted-foreground" />
              <div className="metric-info">
                <span className="metric-label">TPS (Active)</span>
                <span className="metric-value">0.45</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            href="https://github.com/AdekunleBamz/ChainStamps"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View ChainStamps source code on GitHub"
          >
            <Github size={20} strokeWidth={1.5} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow ChainStamps on X (formerly Twitter)"
          >
            <Twitter size={20} strokeWidth={1.5} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            href={`https://explorer.stacks.co/address/${CONTRACT_ADDRESS}?chain=${NETWORK}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View ChainStamps contract on Stacks Explorer"
          >
            <Globe size={20} strokeWidth={1.5} />
          </motion.a>
        </div>

        <p className="footer-copyright" aria-label={`Copyright ${new Date().getFullYear()} ChainStamp - Built on Stacks`}>
          © {new Date().getFullYear()} ChainStamp. Built on Stacks.
        </p>
      </div>
    </footer>
  );
});
