/** Number of microSTX in one STX. Used for fee conversions. */
export const MICROSTX_PER_STX = 1_000_000;

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
 * Maximum allowed fee in STX to prevent runaway estimates.
 */
export const MAX_FEE = 10;

/**
 * Calculates the estimated transaction fee based on payload size.
 * 
 * @param {number | string} payload - The data to be stored or its length in bytes.
 * @returns {number} The estimated fee in STX, rounded to 4 decimal places.
 */
export function estimateFee(payload: number | string): number {
    const rawSize = resolvePayloadSize(payload);
    const size = normalizePayloadSize(rawSize);
    const estimated = BASE_FEE + (size * FEE_PER_BYTE);
    return Math.round(Math.min(estimated, MAX_FEE) * 10000) / 10000;
}

function resolvePayloadSize(payload: number | string): number {
    if (typeof payload === 'number') {
        return payload;
    }

    const normalized = payload.trim();
    if (/^[+-]?\d+(\.\d+)?$/.test(normalized)) {
        return Number(normalized);
    }

    return new TextEncoder().encode(payload).length;
}

function normalizePayloadSize(size: number): number {
    if (!Number.isFinite(size) || size <= 0) {
        return 0;
    }

    return Math.floor(size);
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

/**
 * Formats a microSTX amount with the µSTX symbol.
 *
 * @param microStx - Amount in microSTX (uSTX)
 * @returns Formatted string with µSTX symbol
 */
export function formatUStx(microStx: number): string {
    const normalized = Number.isFinite(microStx) ? Math.max(Math.round(microStx), 0) : 0;
    return `${normalized.toLocaleString()} µSTX`;
}

/**
 * Formats a contract fee in STX, stripping unnecessary trailing zeros.
 *
 * @param fee - The fee amount in STX.
 * @returns A compact human-readable fee string (e.g. "0.03 STX").
 */
export function formatFee(fee: number): string {
    const normalized = Number.isFinite(fee) ? Math.max(fee, 0) : 0;
    return `${parseFloat(normalized.toFixed(4))} STX`;
}

/**
 * Returns true when the given fee falls within the valid range [0, MAX_FEE].
 *
 * @param fee - The fee value in STX to validate.
 * @returns Whether the fee is a finite, non-negative number within bounds.
 */
export function isValidFee(fee: number): boolean {
    return Number.isFinite(fee) && fee >= 0 && fee <= MAX_FEE;
}

/**
 * Returns true if the given fee meets the minimum base fee threshold.
 *
 * @param fee - The fee value in STX.
 * @returns Whether the fee is at least BASE_FEE.
 */
export function isMinimumFee(fee: number): boolean {
    return Number.isFinite(fee) && fee >= BASE_FEE;
}

/**
 * Returns a detailed breakdown of a fee as an object.
 *
 * @param payload - The data or byte count to estimate from.
 * @returns An object with `baseFee`, `payloadFee`, `total`, and `totalMicroStx`.
 */
export function estimateFeeDetailed(payload: number | string): {
    baseFee: number;
    payloadFee: number;
    total: number;
    totalMicroStx: number;
} {
    const size = normalizePayloadSize(resolvePayloadSize(payload));
    const payloadFee = size * FEE_PER_BYTE;
    const total = Math.round(Math.min(BASE_FEE + payloadFee, MAX_FEE) * 10000) / 10000;
    return {
        baseFee: BASE_FEE,
        payloadFee: Math.round(payloadFee * 10000) / 10000,
        total,
        totalMicroStx: stxToMicroStx(total),
    };
}

/**
 * Returns the fee cap headroom — the remaining margin before reaching MAX_FEE.
 *
 * @param currentFee - The current fee in STX.
 * @returns How much STX remains before hitting MAX_FEE.
 */
export function feeHeadroom(currentFee: number): number {
    const normalized = Number.isFinite(currentFee) ? Math.max(currentFee, 0) : 0;
    return Math.max(MAX_FEE - normalized, 0);
}

/**
 * Formats a fee as a percentage of the max allowed fee.
 * @param fee - Current fee in STX.
 * @returns Percentage string e.g. "3.20%".
 */
export function feeAsPercent(fee: number): string {
    const normalized = Number.isFinite(fee) ? Math.min(Math.max(fee, 0), MAX_FEE) : 0;
    return `${((normalized / MAX_FEE) * 100).toFixed(2)}%`;
}

/**
 * Returns true if two fee values are equal within a small tolerance.
 * @param a - First fee in STX.
 * @param b - Second fee in STX.
 * @param tolerance - Allowed difference (default 0.00001).
 */
export function feesAreEqual(a: number, b: number, tolerance = 0.00001): boolean {
    if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
    const normalizedTolerance = Number.isFinite(tolerance) && tolerance >= 0 ? tolerance : 0.00001;
    return Math.abs(a - b) <= normalizedTolerance;
}

/**
 * Converts a fee from STX to a display-friendly microSTX string.
 * @param stx - Fee in STX.
 * @returns Localized microSTX string e.g. "1,000 µSTX".
 */
export function feeToUStxDisplay(stx: number): string {
    return formatUStx(stxToMicroStx(stx));
}
