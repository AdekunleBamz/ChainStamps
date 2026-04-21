
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
