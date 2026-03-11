import { Github, Twitter, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/logo.png" alt="ChainStamps Logo" className="logo-img" />
          <span>ChainStamps</span>
        </div>

        <p className="footer-tagline">
          Permanent on-chain verification on Bitcoin's most secure layer
        </p>

        <div className="footer-links">
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            href="https://github.com/AdekunleBamz/ChainStamps"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={20} strokeWidth={1.5} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter size={20} strokeWidth={1.5} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            href="https://explorer.stacks.co/address/SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT?chain=mainnet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe size={20} strokeWidth={1.5} />
          </motion.a>
        </div>

        <p className="footer-copyright">
          © 2025 ChainStamp. Built on Stacks.
        </p>
      </div>
    </footer>
  );
}
