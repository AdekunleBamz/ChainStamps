import { motion } from 'framer-motion';

const ANIMATIONS = {
  blob1: {
    animate: {
      scale: [1, 1.2, 1],
      x: [0, 100, 0],
      y: [0, 50, 0],
    },
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  },
  blob2: {
    animate: {
      scale: [1, 1.5, 1],
      x: [0, -150, 0],
      y: [0, 100, 0],
    },
    transition: {
      duration: 25,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

/**
 * A decorative mesh gradient background component with smooth animations.
 */
export const MeshGradient = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
            <motion.div
                {...ANIMATIONS.blob1}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"
            />
            <motion.div
                {...ANIMATIONS.blob2}
                className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px]"
            />
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
        </div>
    );
}
