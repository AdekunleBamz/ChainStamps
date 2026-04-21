
export const isValidStampHash = (v) => typeof v === "string" && v.length === 64;

export const isValidStampId = (v) => typeof v === "string" && v.length > 0;

export const isValidTxId = (v) => typeof v === "string" && v.length === 64;

export const isValidBlockHeight = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidStampFee = (v) => !isNaN(Number(v)) && Number(v) >= 0;

export const isValidWalletAddress = (v) => typeof v === "string" && v.startsWith("SP") && v.length > 10;

export const isValidMemoText = (v) => typeof v === "string" && v.length <= 64;

export const isValidFileSize = (v) => !isNaN(Number(v)) && Number(v) > 0;

export const isValidBatchSize = (v) => Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 10;

export const isValidHashAlgorithm = (v) => ["sha256","sha512"].includes(v);
