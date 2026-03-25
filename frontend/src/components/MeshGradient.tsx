import { motion } from 'framer-motion';
import { memo } from 'react';

const ANIMATIONS = {
  blob1: {
    animate: {
      scale: [1, 1.1, 1],
      x: [0, 50, 0],
      y: [0, 30, 0],
    },
    transition: {
      duration: 25,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  blob2: {
    animate: {
      scale: [1, 1.2, 1],
      x: [0, -70, 0],
      y: [0, 50, 0],
    },
    transition: {
      duration: 35,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

/**
 * MeshGradient background component.
 * Provides a visually rich, animated background with glassmorphism effects.
 * Optimized with memoization and hardware-accelerated transforms.
 * 
 * @component
 */
export const MeshGradient = memo(() => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
            <motion.div
                {...ANIMATIONS.blob1}
                className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/15 blur-[120px] will-change-transform"
            />
            <motion.div
                {...ANIMATIONS.blob2}
                className="absolute bottom-[-30%] right-[-10%] w-[70%] h-[70%] rounded-full bg-accent/10 blur-[150px] will-change-transform"
            />
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none noise-bg" />
        </div>
    );
});
