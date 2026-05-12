
/**
 * Builds a stamp transaction payload object.
 * @param {string} hash - The document hash to stamp
 * @param {string} memo - Optional memo/label for the stamp
 * @returns {{ hash: string, memo: string }}
 */
export const buildStampPayload = (hash, memo) => ({ hash, memo });

/**
 * Parses a contract response and returns the result, or null if no txid is present.
 * @param {object|null|undefined} res - Raw response from @stacks/connect
 * @returns {object|null}
 */
export const parseStampResponse = (res) => res && res.txid ? res : null;

/**
 * Returns true if the stamp has passed its expiry block.
 * @param {number} expiry - Expiry block height
 * @param {number} current - Current block height
 * @returns {boolean}
 */
export const isStampExpired = (expiry, current) => current > expiry;

/**
 * Calculates the number of blocks elapsed since a stamp was created.
 * @param {number} blockStamped - Block height when stamp was recorded
 * @param {number} currentBlock - Current chain block height
 * @returns {number} Age in blocks
 */
export const getStampAge = (blockStamped, currentBlock) => currentBlock - blockStamped;

/**
 * Shortens a Stacks address for display (first 8 + last 6 chars).
 * @param {string|null|undefined} addr - Full Stacks address
 * @returns {string} Truncated address or empty string
 */
export const truncateAddress = (addr) => addr ? addr.slice(0, 8) + "..." + addr.slice(-6) : "";

/**
 * Generates a Stacks explorer URL for a given transaction.
 * @param {string} txid - Transaction ID
 * @param {'mainnet'|'testnet'} network - Network identifier
 * @returns {string} Explorer URL
 */
export const stampUrl = (txid, network) => network === "mainnet" ? "https://explorer.hiro.so/txid/" + txid : "https://explorer.hiro.so/txid/" + txid + "?chain=testnet";

/**
 * Applies a percentage buffer to a fee estimate and rounds up.
 * @param {number} fee - Base fee in micro-STX
 * @param {number} pct - Buffer percentage (e.g. 10 for 10 %)
 * @returns {number} Buffered fee rounded up to the nearest integer
 */
export const calcFeeWithBuffer = (fee, pct) => Math.ceil(fee * (1 + pct / 100));

/**
 * Creates a compact stamp summary for lists and logs.
 * @param {{ hash: string, block: number }} stamp - Stamp record to summarize
 * @returns {string} Hash and block-height summary
 */
export const stampSummary = (stamp) => stamp.hash + " @ block " + stamp.block;

export const groupStampsByStatus = (stamps) => stamps.reduce((acc, s) => { (acc[s.status] = acc[s.status] || []).push(s); return acc; }, {});

/**
 * Sorts stamps by block height, newest first.
 * @param {Array} stamps - Array of stamp objects
 * @returns {Array} Sorted copy of stamps
 */
export const sortStampsByBlock = (stamps) => [...stamps].sort((a, b) => b.block - a.block);

/**
 * Returns only stamps with "confirmed" status.
 * @param {Array} stamps - Array of stamp objects
 * @returns {Array} Confirmed stamps
 */
export const filterConfirmedStamps = (stamps) => stamps.filter((s) => s.status === "confirmed");

export const filterPendingStamps = (stamps) => stamps.filter((s) => s.status === "pending");

export const countByStatus = (stamps, status) => stamps.filter((s) => s.status === status).length;

export const mergeStampMeta = (stamp, meta) => Object.assign({}, stamp, meta);

export const stampToJSON = (stamp) => JSON.stringify(stamp, null, 2);

export const hashPreview = (hash) => hash ? hash.slice(0, 12) + "..." : "";

export const blockTimeEstimate = (blocks) => {
	const normalizedBlocks = Number(blocks);
	if (!Number.isFinite(normalizedBlocks) || normalizedBlocks < 0) return '0 minutes';
	return Math.floor(normalizedBlocks * 10) + ' minutes';
};

export const normalizeStampInput = (s) => typeof s === "string" ? s.trim().toLowerCase() : "";

export const stampListStats = (stamps) => ({ total: stamps.length, confirmed: stamps.filter((s) => s.status === "confirmed").length });

/**
 * Resolves a human-readable label for a stamp — uses memo if available, otherwise hash prefix.
 * @param {{ memo?: string, hash: string }} stamp
 * @returns {string}
 */
export const resolveStampLabel = (stamp) => stamp.memo || stamp.hash.slice(0, 10);
