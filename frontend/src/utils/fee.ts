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

export interface FeeEstimateDetails {
    sizeBytes: number;
    baseFee: number;
    payloadFee: number;
    total: number;
    totalMicroStx: number;
    capped: boolean;
}

const DEFAULT_FEE_TOLERANCE = 0.000001;

/**
 * Calculates the estimated transaction fee based on payload size.
 * 
 * @param {number | string} payload - The data to be stored or its length in bytes.
 * @returns {number} The estimated fee in STX, rounded to 4 decimal places.
 */
export function estimateFee(payload: number | string): number {
    const rawSize = resolvePayloadSize(payload);
    const size = Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 0;
    const estimated = BASE_FEE + (size * FEE_PER_BYTE);
    return Math.round(Math.min(estimated, MAX_FEE) * 10000) / 10000;
}

export function estimateFeeDetailed(payload: number | string): FeeEstimateDetails {
    const rawSize = resolvePayloadSize(payload);
    const sizeBytes = Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 0;
    const payloadFee = Math.round(sizeBytes * FEE_PER_BYTE * 10000) / 10000;
    const uncappedTotal = BASE_FEE + payloadFee;
    const total = estimateFee(payload);

    return {
        sizeBytes,
        baseFee: BASE_FEE,
        payloadFee,
        total,
        totalMicroStx: stxToMicroStx(total),
        capped: uncappedTotal > MAX_FEE,
    };
}

/**
 * Resolves an explicit byte count or measures string payload byte length.
 */
function resolvePayloadSize(payload: number | string): number {
    if (typeof payload === 'number') {
        return Number.isFinite(payload) ? payload : 0;
    }

    const normalized = payload.trim();
    if (/^[+-]?\d+(?:\.\d+)?$/.test(normalized)) {
        const size = Number(normalized);
        return Number.isFinite(size) ? Math.floor(size) : 0;
    }

    return new TextEncoder().encode(payload).length;
}

export function formatFee(fee: number): string {
    const normalized = Number.isFinite(fee) ? Math.max(fee, 0) : 0;
    if (normalized === 0) {
        return '0 STX';
    }

    const compact = normalized.toFixed(4).replace(/\.?0+$/, '');
    return `${compact} STX`;
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

export function isValidFee(fee: number): boolean {
    return Number.isFinite(fee) && fee >= 0 && fee <= MAX_FEE;
}

export function isMinimumFee(fee: number): boolean {
    return Number.isFinite(fee) && fee >= BASE_FEE;
}

export function feesAreEqual(a: number, b: number, tolerance = DEFAULT_FEE_TOLERANCE): boolean {
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
        return false;
    }

    const normalizedTolerance =
        Number.isFinite(tolerance) && tolerance > 0 ? tolerance : DEFAULT_FEE_TOLERANCE;
    return Math.abs(a - b) <= normalizedTolerance + Number.EPSILON;
}

export function feeAsPercent(fee: number): string {
    const normalized = Number.isFinite(fee) ? Math.min(Math.max(fee, 0), MAX_FEE) : 0;
    return `${((normalized / MAX_FEE) * 100).toFixed(2)}%`;
}

export function feeToUStxDisplay(fee: number): string {
    return formatUStx(stxToMicroStx(fee));
}

export function feeHeadroom(fee: number): number {
    const normalized = Number.isFinite(fee) ? Math.max(fee, 0) : 0;
    const headroom = Math.max(MAX_FEE - normalized, 0);
    return Math.round(headroom * 10000) / 10000;
}

/**
 * Returns true if a fee value is within the acceptable range.
 * @param fee - Fee in STX
 * @returns `true` if fee is a non-negative finite number not exceeding MAX_FEE
 */
export function isAcceptableFee(fee: number): boolean {
  return isValidFee(fee);
}
