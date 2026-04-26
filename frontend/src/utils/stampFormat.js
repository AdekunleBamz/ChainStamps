
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

export const formatMicroStx = (v) => (v / MICROSTX_PER_STX).toFixed(6) + " STX";

export const formatStampCount = (n) => n + " stamps";

export const formatBatchId = (id) => "BATCH-" + id;

export const formatFileSize = (b) => (b / 1024).toFixed(2) + " KB";

export const formatWalletAddress = (a) => {
  const normalized = typeof a === 'string' ? a.trim() : '';
  if (!normalized) return '';
  if (normalized.length <= 10) return normalized;
  return normalized.slice(0, 6) + '...' + normalized.slice(-4);
};

export const formatProofLength = (n) => n + " chars";

export const formatNetworkName = (n) => {
  const normalized = typeof n === 'string' ? n.trim().toLowerCase() : '';
  if (!normalized) return 'Unknown';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const formatConfirmations = (n) => n + " confirmations";

export const formatStampType = (t) => t.toUpperCase();

export const formatBlocksRemaining = (n) => n + " blocks left";

export const formatMemoText = (s) => {
  const normalized = typeof s === 'string' ? s.trim() : '';
  if (!normalized) return '';
  return normalized.length > 32 ? normalized.slice(0, 32) + '...' : normalized;
};

export const formatHashAlgorithm = (a) => a.toUpperCase();

export const formatStampVersion = (v) => "v" + v;

export const formatExpiryDate = (ts) => "Expires: " + new Date(ts).toLocaleDateString();

export const formatStampAge = (blocks, blocksPerDay) => {
  const days = Math.floor(blocks / blocksPerDay);
  return days + (days === 1 ? " day old" : " days old");
};

export const formatBatchProgress = (done, total) => done + " / " + total + " stamps";

export const formatStampFeeUstx = (v) => Number(v).toLocaleString() + " µSTX fee";

export const formatConfirmationStatus = (n, required) => n + " / " + required + " confirmed";

export const formatRetryCount = (n) => "Attempt " + (n + 1);

export const formatStampLabel = (label, hash) => label || hash.slice(0, 10);
