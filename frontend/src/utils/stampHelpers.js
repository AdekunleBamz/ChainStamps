
export const buildStampPayload = (hash, memo) => ({ hash, memo });

export const parseStampResponse = (res) => res && res.txid ? res : null;

export const isStampExpired = (expiry, current) => current > expiry;

export const getStampAge = (blockStamped, currentBlock) => currentBlock - blockStamped;

export const truncateAddress = (addr) => addr ? addr.slice(0, 8) + "..." + addr.slice(-6) : "";

export const stampUrl = (txid, network) => network === "mainnet" ? "https://explorer.hiro.so/txid/" + txid : "https://explorer.hiro.so/txid/" + txid + "?chain=testnet";

export const calcFeeWithBuffer = (fee, pct) => Math.ceil(fee * (1 + pct / 100));

export const stampSummary = (stamp) => stamp.hash + " @ block " + stamp.block;

export const groupStampsByStatus = (stamps) => stamps.reduce((acc, s) => { (acc[s.status] = acc[s.status] || []).push(s); return acc; }, {});

export const sortStampsByBlock = (stamps) => [...stamps].sort((a, b) => b.block - a.block);

export const filterConfirmedStamps = (stamps) => stamps.filter((s) => s.status === "confirmed");

export const filterPendingStamps = (stamps) => stamps.filter((s) => s.status === "pending");

export const countByStatus = (stamps, status) => stamps.filter((s) => s.status === status).length;

export const mergeStampMeta = (stamp, meta) => Object.assign({}, stamp, meta);

export const stampToJSON = (stamp) => JSON.stringify(stamp, null, 2);

export const hashPreview = (hash) => hash ? hash.slice(0, 12) + "..." : "";

export const blockTimeEstimate = (blocks) => blocks * 10 + " minutes";

export const normalizeStampInput = (s) => typeof s === "string" ? s.trim().toLowerCase() : "";
