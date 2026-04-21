
export const isValidStampHash = (v) => typeof v === "string" && v.length === 64;

export const isValidStampId = (v) => typeof v === "string" && v.length > 0;
