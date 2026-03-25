/**
 * Global application constants.
 */

export const ANIMATIONS = {
  SHAKE: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  },
  FADE_UP: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },
  STAGGER: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

export const UI = {
  TOAST_DURATION: 3000,
  HAPTIC_COOLDOWN: 200,
  RATE_LIMIT_COOLDOWN: 2000,
  SKELETON_DELAY: 1200
};
