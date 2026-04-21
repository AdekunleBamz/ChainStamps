
import { MICROSTX_PER_STX } from './stampConstants.js';

export const formatStampHash = (h) => {
  const normalized = typeof h === 'string' ? h.trim() : '';
  if (!normalized) return '';
  if (normalized.length <= 16) return normalized;
  return normalized.slice(0, 8) + '...' + normalized.slice(-8);
};

export const formatStampFee = (v) => (v / MICROSTX_PER_STX).toFixed(6) + " STX";

export const formatStampDate = (ts) => new Date(ts).toLocaleDateString();

export const formatStampId = (id) => "STAMP-" + id;

export const formatBlockHeight = (n) => "Block #" + n;

export const formatStampStatus = (s) => {
  const normalized = typeof s === 'string' ? s.trim().toLowerCase() : '';
  if (!normalized) return 'Unknown';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const formatTxId = (id) => id.slice(0, 8) + "...";

export const formatMicroStx = (v) => (v / 1e6).toFixed(6) + " STX";
