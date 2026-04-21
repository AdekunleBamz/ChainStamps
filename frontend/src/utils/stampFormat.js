
export const formatStampHash = (h) => h.slice(0, 8) + "..." + h.slice(-8);

export const formatStampFee = (v) => (v / 1e6).toFixed(6) + " STX";
