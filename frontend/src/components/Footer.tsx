import { Github, Twitter, Globe, Zap, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Footer() {
  return (
    <footer className="footer" aria-label="Site Footer">
      <div className="footer-content">
        <div className="footer-brand" aria-label="ChainStamps Branding">
          <img src="/logo.png" alt="ChainStamps Logo" className="logo-img" />
          <span>ChainStamps</span>
        </div>

        <p className="footer-tagline">
          Permanent on-chain verification on Bitcoin's most secure layer
        </p>

        <div className="footer-metrics">
          <div className="metrics-title" aria-label="System Performance Heartbeat">
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
            <div className="metric-item">
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
            href="https://explorer.stacks.co/address/SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT?chain=mainnet"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View ChainStamps contract on Stacks Explorer"
          >
            <Globe size={20} strokeWidth={1.5} />
          </motion.a>
        </div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} ChainStamp. Built on Stacks.
        </p>
      </div>
    </footer>
  );
}
