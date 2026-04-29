import { motion } from 'framer-motion';
import { memo } from 'react';

const EASE_STANDARD = [0.22, 1, 0.36, 1] as const;

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
      ease: EASE_STANDARD
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
      ease: EASE_STANDARD
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
                style={{ transform: 'translateZ(0)' }}
                className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[80px] will-change-transform"
            />
            <motion.div
                {...ANIMATIONS.blob2}
                style={{ transform: 'translateZ(0)' }}
                className="absolute bottom-[-30%] right-[-10%] w-[70%] h-[70%] rounded-full bg-accent/5 blur-[100px] will-change-transform"
            />
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none noise-bg" />
        </div>
    );
});
