
export const formatStampHash = (h) => h.slice(0, 8) + "..." + h.slice(-8);

export const formatStampFee = (v) => (v / 1e6).toFixed(6) + " STX";

export const formatStampDate = (ts) => new Date(ts).toLocaleDateString();

export const formatStampId = (id) => "STAMP-" + id;

export const formatBlockHeight = (n) => "Block #" + n;

export const formatStampStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatTxId = (id) => id.slice(0, 8) + "...";

export const formatMicroStx = (v) => (v / 1e6).toFixed(6) + " STX";

export const formatStampCount = (n) => n + " stamps";

export const formatBatchId = (id) => "BATCH-" + id;

export const formatFileSize = (b) => (b / 1024).toFixed(2) + " KB";

export const formatWalletAddress = (a) => a.slice(0, 6) + "..." + a.slice(-4);

export const formatProofLength = (n) => n + " chars";

export const formatNetworkName = (n) => n.charAt(0).toUpperCase() + n.slice(1);

export const formatConfirmations = (n) => n + " confirmations";

export const formatStampType = (t) => t.toUpperCase();

export const formatBlocksRemaining = (n) => n + " blocks left";

export const formatMemoText = (s) => s.length > 32 ? s.slice(0, 32) + "..." : s;
