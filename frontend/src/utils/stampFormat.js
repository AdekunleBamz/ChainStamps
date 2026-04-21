
export const formatStampHash = (h) => h.slice(0, 8) + "..." + h.slice(-8);

export const formatStampFee = (v) => (v / 1e6).toFixed(6) + " STX";

export const formatStampDate = (ts) => new Date(ts).toLocaleDateString();

export const formatStampId = (id) => "STAMP-" + id;

export const formatBlockHeight = (n) => "Block #" + n;

export const formatStampStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatTxId = (id) => id.slice(0, 8) + "...";

export const formatMicroStx = (v) => (v / 1e6).toFixed(6) + " STX";

export const formatStampCount = (n) => n + " stamps";
