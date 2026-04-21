
export const isValidStampHash = (v) => typeof v === "string" && v.length === 64;

export const isValidStampId = (v) => typeof v === "string" && v.length > 0;

export const isValidTxId = (v) => typeof v === "string" && v.length === 64;

export const isValidBlockHeight = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export const isValidStampFee = (v) => !isNaN(Number(v)) && Number(v) >= 0;
