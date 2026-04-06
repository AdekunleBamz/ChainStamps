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

/**
 * Converts STX amount to microSTX (uSTX).
 * Useful for displaying fees in the UI with higher precision.
 * 
 * @param {number} stx - Amount in STX
 * @returns {number} Amount in microSTX (uSTX)
 */
export function stxToMicroStx(stx: number): number {
    return Math.round(stx * 1_000_000);
}

/**
 * Converts microSTX (uSTX) to STX.
 * Useful for parsing contract fee values.
 *
 * @param microStx - Amount in microSTX (uSTX)
 * @returns Amount in STX
 */
export function microStxToStx(microStx: number): number {
    return microStx / 1_000_000;
}

/** Number of microSTX in one STX. Used for fee conversions. */
const MICROSTX_PER_STX = 1_000_000;

/**
 * Formats an STX amount with the currency symbol.
 *
 * @param stx - Amount in STX
 * @returns Formatted string with STX symbol
 */
export function formatStx(stx: number): string {
    return `${stx.toFixed(4)} STX`;
}
