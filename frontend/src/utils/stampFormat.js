
import { MICROSTX_PER_STX } from './stampConstants.js';

/**
 * Truncates a stamp hash for display.
 * @param {string|null|undefined} h - Full hash string
 * @returns {string} Shortened hash, e.g. "abcd1234...5678efgh"
 */
export const formatStampHash = (h) => {
  const normalized = typeof h === 'string' ? h.trim() : '';
  if (!normalized) return '';
  if (normalized.length <= 16) return normalized;
  return normalized.slice(0, 8) + '...' + normalized.slice(-8);
};

/**
 * Formats a microSTX fee as a STX decimal string.
 * @param {number} v - Fee in microSTX
 * @remarks The value is displayed with fixed precision to match contract fee units.
 * @returns {string} e.g. "1.000000 STX"
 */
export const formatStampFee = (v) => (v / MICROSTX_PER_STX).toFixed(6) + " STX";

/**
 * Formats a Unix timestamp as a locale date string.
 * @param {number|null|undefined} ts - Timestamp in ms
 * @returns {string} Formatted date or empty string
 */
export const formatStampDate = (ts) => {
  if (ts == null) return '';
  return new Date(ts).toLocaleDateString();
};

/**
 * Formats a stamp numeric ID with the STAMP- prefix.
 * @param {number|string} id - Stamp identifier (numeric or string)
 * @returns {string} e.g. "STAMP-42"
 */
export const formatStampId = (id) => "STAMP-" + id;

/**
 * Formats a Stacks block height for display.
 * @param {number} n - Block height
 * @returns {string} e.g. "Block #123456"
 */
export const formatBlockHeight = (n) => "Block #" + n;

/**
 * Formats the age of a stamp as an approximate day count.
 * @param {number} blocks - Number of blocks since stamp was created
 * @returns {string} e.g. "3 days ago"
 */
export const formatStampAge = (blocks) => {
  const days = Math.floor(blocks / 144);
  if (days === 0) return 'today';
  return days + (days === 1 ? ' day ago' : ' days ago');
};

/**
 * Formats a block confirmation count for display.
 * @param {number} n - Number of confirmations
 * @returns {string} e.g. "3 confirmations" or "Unconfirmed"
 */
export const formatConfirmations = (n) => {
  if (!n || n <= 0) return 'Unconfirmed';
  return n + (n === 1 ? ' confirmation' : ' confirmations');
};

/**
 * Formats stamp lifecycle status labels.
 * @param {string|null|undefined} status
 * @returns {string}
 */
export const formatStampStatus = (status) => {
  const normalized = typeof status === 'string' ? status.trim().toLowerCase() : '';
  if (!normalized) return 'Unknown';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

/**
 * Formats transaction id for compact UI display.
 * @param {string|null|undefined} txid
 * @returns {string}
 */
export const formatTxId = (txid) => {
  const normalized = typeof txid === 'string' ? txid.trim() : '';
  if (!normalized) return '';
  if (normalized.length <= 8) return normalized;
  return normalized.slice(0, 8) + '...';
};

/**
 * Formats microSTX values as STX with fixed precision.
 * @param {number} value
 * @returns {string}
 */
export const formatMicroStx = (value) => (value / MICROSTX_PER_STX).toFixed(6) + ' STX';

/**
 * Formats stamp count labels with pluralization.
 * @param {number} count
 * @returns {string}
 */
export const formatStampCount = (count) => `${count} ${count === 1 ? 'stamp' : 'stamps'}`;

/**
 * Prefixes batch ids for UI clarity.
 * @param {string|number} batchId
 * @returns {string}
 */
export const formatBatchId = (batchId) => `BATCH-${batchId}`;

/**
 * Formats byte sizes with KB fallback.
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
};

/**
 * Formats proof length values.
 * @param {number|string} length
 * @returns {string}
 */
export const formatProofLength = (length) => `${length} chars`;

/**
 * Formats wallet addresses for compact display.
 * @param {string|null|undefined} address
 * @returns {string}
 */
export const formatWalletAddress = (address) => {
  const normalized = typeof address === 'string' ? address.trim() : '';
  if (!normalized) return '';
  if (normalized.length <= 10) return normalized;
  return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`;
};

/**
 * Trims and truncates memo text for compact UI slots.
 * @param {unknown} memo
 * @returns {string}
 */
export const formatMemoText = (memo) => {
  if (typeof memo !== 'string') return '';
  const normalized = memo.trim();
  if (normalized.length <= 32) return normalized;
  return `${normalized.slice(0, 32)}...`;
};

/**
 * Formats network labels with safe fallback.
 * @param {string|null|undefined} network
 * @returns {string}
 */
export const formatNetworkName = (network) => {
  const normalized = typeof network === 'string' ? network.trim().toLowerCase() : '';
  if (!normalized) return 'Unknown';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

/**
 * Formats stamp types in uppercase.
 * @param {string|null|undefined} type
 * @returns {string}
 */
export const formatStampType = (type) => {
  const normalized = typeof type === 'string' ? type.trim() : '';
  return normalized.toUpperCase();
};

/**
 * Formats remaining blocks for cooldown/status displays.
 * @param {number} blocks
 * @returns {string}
 */
export const formatBlocksRemaining = (blocks) => `${blocks} blocks left`;

/**
 * Formats hash algorithm labels in uppercase.
 * @param {string|null|undefined} algorithm
 * @returns {string}
 */
export const formatHashAlgorithm = (algorithm) => {
  const normalized = typeof algorithm === 'string' ? algorithm.trim() : '';
  return normalized.toUpperCase();
};

/**
 * Formats version strings with a leading v.
 * @param {string|number} version
 * @returns {string}
 */
export const formatStampVersion = (version) => `v${version}`;
