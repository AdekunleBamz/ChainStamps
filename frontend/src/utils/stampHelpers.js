
export const buildStampPayload = (hash, memo) => ({ hash, memo });

export const parseStampResponse = (res) => res && res.txid ? res : null;

export const isStampExpired = (expiry, current) => current > expiry;

export const getStampAge = (blockStamped, currentBlock) => currentBlock - blockStamped;

export const truncateAddress = (addr) => addr ? addr.slice(0, 8) + "..." + addr.slice(-6) : "";
