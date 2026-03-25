import { Shield, Clock, Database } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, memo, type ComponentType } from 'react';

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

const FeatureItem = memo(({ icon: Icon, title, description, ariaLabel }: { icon: ComponentType<{ className?: string; size?: number; strokeWidth?: number }>, title: string, description: string, ariaLabel: string }) => (
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
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);

  return (
    <motion.section
      ref={containerRef}
      className="hero relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={CONTAINER_VARIANTS}
      style={{ opacity }}
    >
      <motion.div 
        className="hero-glow" 
        aria-hidden="true" 
        style={{ y: y1 }}
      />
      <motion.div 
        className="hero-floating-element absolute top-1/4 right-10 w-64 h-64 bg-primary/10 rounded-full blur-[120px] -z-10"
        aria-hidden="true"
        style={{ y: y2 }}
      />
      <motion.div 
        className="hero-floating-element absolute bottom-1/4 left-10 w-48 h-48 bg-accent/10 rounded-full blur-[100px] -z-10"
        aria-hidden="true"
        style={{ y: y1 }}
      />

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

      <motion.div 
        className="hero-cta flex-center gap-4" 
        variants={ITEM_VARIANTS}
      >
        <button
          onClick={() => {
            const connectBtn = document.querySelector('.connect-btn') as HTMLButtonElement;
            connectBtn?.click();
          }}
          className="cta-primary h-14 px-8 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          aria-label="Connect Stacks Wallet to get started"
        >
          Get Started
          <Shield size={20} />
        </button>
        <a 
          href="#hash" 
          className="cta-secondary h-14 px-8 rounded-2xl border border-border bg-white/5 backdrop-blur-md text-primary font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
        >
          Learn More
        </a>
      </motion.div>

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
