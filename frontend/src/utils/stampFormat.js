
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
 * @param {number|string} id - Stamp identifier
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
