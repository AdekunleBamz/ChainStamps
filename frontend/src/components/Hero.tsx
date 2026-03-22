import { Shield, Clock, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { memo } from 'react';

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeatureItem = memo(({ icon: Icon, title, description, ariaLabel }: { icon: any, title: string, description: string, ariaLabel: string }) => (
  <motion.div className="feature group will-change-transform" variants={ITEM_VARIANTS} aria-label={ariaLabel}>
    <div className="feature-icon-wrapper flex-center shadow-md aspect-square w-16 h-16 mx-auto">
      <Icon className="feature-icon" size={40} strokeWidth={1.5} />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </motion.div>
));

/**
 * Hero section component.
 * Displays the main value proposition and core feature highlights.
 * Optimized with component memoization and GPU-accelerated animations.
 * 
 * @component
 */
export const Hero = () => {
  return (
    <motion.section
      className="hero relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={CONTAINER_VARIANTS}
    >
      <div className="hero-glow" aria-hidden="true" />

      <motion.h1 className="hero-title will-change-transform" variants={ITEM_VARIANTS}>
        <span className="gradient-text from-primary to-accent-hover">ChainStamps</span>
        <span className="sr-only">: Secure Blockchain Document Verification</span>
      </motion.h1>

      <motion.p className="hero-subtitle will-change-transform" variants={ITEM_VARIANTS} aria-label="Subtitle: Permanent on-chain verification">
        Permanent on-chain verification for documents, messages, and data
      </motion.p>

      <motion.p className="hero-description will-change-transform" variants={ITEM_VARIANTS} aria-label="Description: Detailed explanation of ChainStamps and Stacks blockchain integration">
        Store SHA-256 hashes, timestamps, and metadata immutably on
        Bitcoin's most secure layer through the Stacks blockchain.
      </motion.p>

      <motion.div className="features" variants={CONTAINER_VARIANTS}>
        <FeatureItem 
          icon={Shield} 
          title="Immutable" 
          description="Data secured by Bitcoin's proof-of-work" 
          ariaLabel="Feature: Immutable" 
        />
        <FeatureItem 
          icon={Clock} 
          title="Timestamped" 
          description="Permanent proof of existence" 
          ariaLabel="Feature: Timestamped" 
        />
        <FeatureItem 
          icon={Database} 
          title="Verifiable" 
          description="Anyone can verify your data" 
          ariaLabel="Feature: Verifiable" 
        />
      </motion.div>
    </motion.section>
  );
}
