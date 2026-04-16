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

/** Maximum retries for failed blockchain API calls. */
export const MAX_API_RETRIES = 3;

/** Delay between API retry attempts in milliseconds. */
export const API_RETRY_DELAY = 1000;

/** Interval in milliseconds between on-chain fee refreshes. */
export const FEE_REFRESH_INTERVAL = 60_000;

/** Interval in milliseconds for polling the latest Stacks block height. */
export const BLOCK_FETCH_INTERVAL = 30_000;
