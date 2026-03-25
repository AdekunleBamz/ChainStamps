/**
 * Base transaction fee in STX.
 * Represents the minimum cost to interact with the ChainStamp contracts.
 */
export const BASE_FEE = 0.001;

/**
 * Fee per byte of data stored on-chain (in STX).
 * Used to calculate dynamic fees for messages and tags.
 */
export const FEE_PER_BYTE = 0.00005;

/**
 * Calculates the estimated transaction fee based on payload size.
 * 
 * @param {number | string} payload - The data to be stored or its length in bytes.
 * @returns {number} The estimated fee in STX, rounded to 4 decimal places.
 */
export function estimateFee(payload: number | string): number {
    const size = typeof payload === 'string' ? new Blob([payload]).size : payload;
    const estimated = BASE_FEE + (size * FEE_PER_BYTE);
    return Math.round(estimated * 10000) / 10000;
}
