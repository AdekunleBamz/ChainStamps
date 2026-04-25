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

/** Minimum number of characters required for a valid tag name. */
export const MIN_TAG_LENGTH = 1;

/** Maximum number of characters allowed in a stamp tag. */
export const MAX_TAG_LENGTH = 64;

/** Frozen map of supported stamp types shown in the create stamp UI. */
export const STAMP_TYPES = Object.freeze({
  FILE: 'file',
  TEXT: 'text',
  URL: 'url',
} as const);

/** Number of blocks per day on Stacks (10-minute block time × 6 × 24). */
export const STACKS_BLOCKS_PER_DAY = 144;

/** Average block time in seconds. */
export const AVG_BLOCK_TIME_SECONDS = 600;

/** Minimum STX balance in microSTX required to be able to submit a transaction. */
export const MIN_STX_FOR_TX_MICROSTX = 1000; // 0.001 STX

/** Maximum number of characters allowed in a stamp note or message field. */
export const MAX_NOTE_LENGTH = 500;

/** Debounce delay specifically for search input fields (ms). */
export const SEARCH_DEBOUNCE_MS = 250;

/** Maximum number of search result items to display without pagination. */
export const MAX_SEARCH_RESULTS = 100;

/** Timeout in ms after which a pending transaction is considered stuck. */
export const TX_STUCK_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

/** Short-form address display: characters kept at start. */
export const SHORT_ADDR_START = 6;
/** Short-form address display: characters kept at end. */
export const SHORT_ADDR_END = 4;

/** Frozen set of supported hash algorithms for file fingerprinting. */
export const SUPPORTED_HASH_ALGORITHMS = Object.freeze(['SHA-256'] as const);

/** Display name for the application. */
export const APP_DISPLAY_NAME = 'ChainStamp';
