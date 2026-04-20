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
  SKELETON_DELAY: 1200,
  COPY_SUCCESS_DURATION: 2000,
};

/** Maximum retries for failed blockchain API calls. */
export const MAX_API_RETRIES = 3;

/** Delay between API retry attempts in milliseconds. */
export const API_RETRY_DELAY = 1000;

/** Interval in milliseconds between on-chain fee refreshes. */
export const FEE_REFRESH_INTERVAL = 60_000;

/** Interval in milliseconds for polling the latest Stacks block height. */
export const BLOCK_FETCH_INTERVAL = 30_000;

/** Maximum file size allowed for hashing in megabytes. */
export const MAX_FILE_SIZE_MB = 100;

/** Default debounce delay in milliseconds for search and input handlers. */
export const DEFAULT_DEBOUNCE_DELAY_MS = 300;

/** Expected length (in hex characters) of a SHA-256 hash output. */
export const HASH_HEX_LENGTH = 64;

/** Pagination defaults for registry browsing. */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

/** Base URL for the Stacks explorer (mainnet). */
export const EXPLORER_BASE_URL = 'https://explorer.stacks.co';

/** Maximum number of past stamps to show in the recent activity list. */
export const MAX_RECENT_STAMPS = 50;
