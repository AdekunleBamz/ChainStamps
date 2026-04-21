
export const buildStampPayload = (hash, memo) => ({ hash, memo });

export const parseStampResponse = (res) => res && res.txid ? res : null;
