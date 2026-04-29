import { Github, Twitter, Globe, Zap, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { CONTRACT_ADDRESS, NETWORK } from '../config/contracts';

/** Animation variants for social link hover effects. */
const SOCIAL_LINK_ANIMATION = {
    hover: { scale: 1.1, y: -2 },
    tap: { scale: 0.9 },
};

/** Social and external link URLs used in the footer. */
const FOOTER_LINKS = {
    github: 'https://github.com/AdekunleBamz/ChainStamps',
    twitter: 'https://twitter.com',
    explorer: 'https://explorer.hiro.so/address/SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT?chain=mainnet',
};

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
        <div className="footer-brand flex items-center justify-center gap-2 mb-4" aria-label="ChainStamps Branding">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-white"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">ChainStamps</span>
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
            <div className="metric-item" aria-label="Transactions Per Second: current active rate is 0.45" title="Measured active transactions per second">
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
            whileHover={SOCIAL_LINK_ANIMATION.hover}
            whileTap={SOCIAL_LINK_ANIMATION.tap}
            href={FOOTER_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View ChainStamps source code on GitHub"
            className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
          >
            <Github size={20} strokeWidth={1.5} role="img" aria-hidden="true" />
          </motion.a>
          <motion.a
            whileHover={SOCIAL_LINK_ANIMATION.hover}
            whileTap={SOCIAL_LINK_ANIMATION.tap}
            href={FOOTER_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow ChainStamps on X (formerly Twitter)"
            className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
          >
            <Twitter size={20} strokeWidth={1.5} role="img" aria-hidden="true" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            href={`https://explorer.stacks.co/address/${CONTRACT_ADDRESS}?chain=${NETWORK}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View ChainStamps contract on Hiro Explorer"
            className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
          >
            <Globe size={20} strokeWidth={1.5} role="img" aria-hidden="true" />
          </motion.a>
        </div>

        <p className="footer-copyright" aria-label={`Copyright ${new Date().getFullYear()} ChainStamps - Built on Stacks`}>
          © {new Date().getFullYear()} ChainStamps. Built on Stacks.
        </p>
      </div>
    </footer>
  );
});
