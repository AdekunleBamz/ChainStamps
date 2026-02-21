import { Github, Twitter, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="logo-icon">⛓️</span>
          <span>ChainStamp</span>
        </div>

        <p className="footer-tagline">
          Permanent on-chain verification on Bitcoin's most secure layer
        </p>

        <div className="footer-links">
          <a
            href="https://github.com/AdekunleBamz/ChainStamps"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://explorer.stacks.co/address/SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT?chain=mainnet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe size={20} />
          </a>
        </div>

        <p className="footer-copyright">
          © 2025 ChainStamp. Built on Stacks.
        </p>
      </div>
    </footer>
  );
}
