
import { MAX_BATCH_SIZE, MAX_MEMO_LENGTH } from './stampConstants.js';

export const isValidStampHash = (v) =>
  typeof v === 'string' && /^[a-fA-F0-9]{64}$/.test(v.trim());

export const isValidStampId = (v) => typeof v === "string" && v.length > 0;

export const isValidTxId = (v) =>
  typeof v === 'string' && /^(0x)?[a-fA-F0-9]{64}$/.test(v.trim());

export const isValidBlockHeight = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidStampFee = (v) => !isNaN(Number(v)) && Number(v) >= 0;

export const isValidWalletAddress = (v) =>
  typeof v === 'string' && /^(SP|ST)[0-9A-Z]{30,}$/.test(v.trim().toUpperCase());

export const isValidMemoText = (v) => typeof v === 'string' && v.trim().length <= MAX_MEMO_LENGTH;

export const isValidFileSize = (v) => !isNaN(Number(v)) && Number(v) > 0;

export const isValidBatchSize = (v) => Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= MAX_BATCH_SIZE;

export const isValidHashAlgorithm = (v) =>
  typeof v === 'string' && ['sha256', 'sha512'].includes(v.trim().toLowerCase());

export const isValidStampStatus = (v) => ["pending","confirmed","failed"].includes(v);

export const isValidStampType = (v) => typeof v === "string" && v.length > 0;

export const isValidNetworkName = (v) => ["mainnet","testnet"].includes(v);

export const isValidConfirmations = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidStampVersion = (v) => typeof v === "string" && /^\d+\.\d+\.\d+$/.test(v);

export const isValidProofLength = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

export const isValidStampCount = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidMicroStx = (v) => !isNaN(Number(v)) && Number(v) >= 0;

export const isValidDataLength = (v) => Number.isInteger(Number(v)) && Number(v) > 0 && Number(v) <= 256;

export const isValidBatchId = (v) => typeof v === "string" && v.length > 0;

export const isValidExpiryBlocks = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidStampAge = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidRetryCount = (v) => Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 3;
