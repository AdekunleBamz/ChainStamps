import { Github, Twitter, ExternalLink, ShieldCheck, Zap, Clock, Activity } from 'lucide-react';
import { memo } from 'react';
import { motion } from 'framer-motion'; // Keep motion if it's used elsewhere, but the new Footer doesn't use it.

/**
 * Footer component for the application.
 * Displays brand information, social links, and current Stacks network metrics.
 * Optimized with React.memo to prevent unnecessary re-renders.
 * 
 * @component
 */
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
}
