import { Shield, Clock, Database } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, memo, type ComponentType } from 'react';
import { AnimatedNumber } from './ui/AnimatedNumber';

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

const HeroBackground = memo(({ y1, y2 }: { y1: any, y2: any }) => (
  <>
    <motion.div className="hero-glow" aria-hidden="true" style={{ y: y1 }} />
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
  </>
));

const HeroFeatures = memo(() => (
  <motion.div className="features" variants={CONTAINER_VARIANTS}>
    <FeatureItem icon={Shield} title="Immutable" description="Data secured by Bitcoin's proof-of-work" ariaLabel="Feature: Immutable" />
    <FeatureItem icon={Clock} title="Timestamped" description="Permanent proof of existence" ariaLabel="Feature: Timestamped" />
    <FeatureItem icon={Database} title="Verifiable" description="Anyone can verify your data" ariaLabel="Feature: Verifiable" />
  </motion.div>
));

const HeroStats = memo(() => (
  <motion.div className="hero-stats grid grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto border-t border-border/50 pt-16" variants={CONTAINER_VARIANTS}>
    <div className="stat flex flex-col gap-1 min-h-[64px]">
      <span className="text-3xl font-bold gradient-text"><AnimatedNumber value={25430} />+</span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Stamps Created</span>
    </div>
    <div className="stat flex flex-col gap-1 border-x border-border/50 min-h-[64px]">
      <span className="text-3xl font-bold gradient-text"><AnimatedNumber value={1200} />+</span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Unique Users</span>
    </div>
    <div className="stat flex flex-col gap-1 min-h-[64px]">
      <span className="text-3xl font-bold gradient-text"><AnimatedNumber value={100} />%</span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Verifiable</span>
    </div>
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
      <HeroBackground y1={y1} y2={y2} />

      <motion.h1 className="hero-title will-change-transform" variants={ITEM_VARIANTS}>
        <span className="gradient-text from-primary to-accent-hover">ChainStamps</span>
        <span className="sr-only">: Secure Blockchain Document Verification</span>
      </motion.h1>

      <motion.p className="hero-subtitle will-change-transform" variants={ITEM_VARIANTS}>
        Permanent on-chain verification for documents, messages, and data
      </motion.p>

      <motion.p className="hero-description will-change-transform" variants={ITEM_VARIANTS}>
        Store SHA-256 hashes, timestamps, and metadata immutably on
        Bitcoin's most secure layer through the Stacks blockchain.
      </motion.p>

      <motion.div className="hero-cta flex-center gap-4" variants={ITEM_VARIANTS}>
        <button
          type="button"
          onClick={() => (document.querySelector('.connect-btn') as HTMLButtonElement)?.click()}
          className="cta-primary h-14 px-8 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          Get Started
          <Shield size={20} />
        </button>
        <a href="#hash" className="cta-secondary h-14 px-8 rounded-2xl border border-border bg-white/5 backdrop-blur-md text-primary font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
          Learn More
        </a>
      </motion.div>

      <HeroFeatures />
      <HeroStats />

      <motion.div 
        className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
        role="button"
        aria-label="Scroll to registry section"
        title="Scroll to registry section"
        tabIndex={0}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => document.querySelector('#hash')?.scrollIntoView({ behavior: 'smooth' })}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            document.querySelector('#hash')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-transparent"
          aria-hidden="true"
        />
      </motion.div>
    </motion.section>
  );
}
