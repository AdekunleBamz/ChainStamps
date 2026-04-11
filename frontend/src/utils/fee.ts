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
    const rawSize = resolvePayloadSize(payload);
    const size = Number.isFinite(rawSize) && rawSize > 0 ? rawSize : 0;
    const estimated = BASE_FEE + (size * FEE_PER_BYTE);
    return Math.round(estimated * 10000) / 10000;
}

function resolvePayloadSize(payload: number | string): number {
    if (typeof payload === 'number') {
        return Number.isFinite(payload) ? payload : 0;
    }

    const normalized = payload.trim();
    if (/^\d+$/.test(normalized)) {
        return Number(normalized);
    }

    return new TextEncoder().encode(payload).length;
}

/**
 * Converts STX amount to microSTX (uSTX).
 * Useful for displaying fees in the UI with higher precision.
 * 
 * @param {number} stx - Amount in STX
 * @returns {number} Amount in microSTX (uSTX)
 */
export function stxToMicroStx(stx: number): number {
    const normalizedStx = Number.isFinite(stx) ? Math.max(stx, 0) : 0;
    return Math.round(normalizedStx * MICROSTX_PER_STX);
}

/**
 * Converts microSTX (uSTX) to STX.
 * Useful for parsing contract fee values.
 *
 * @param microStx - Amount in microSTX (uSTX)
 * @returns Amount in STX
 */
export function microStxToStx(microStx: number): number {
    const normalizedMicroStx = Number.isFinite(microStx) ? Math.max(microStx, 0) : 0;
    return normalizedMicroStx / MICROSTX_PER_STX;
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
    const normalized = Number.isFinite(stx) ? Math.max(stx, 0) : 0;
    return `${normalized.toFixed(4)} STX`;
}
