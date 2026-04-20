import { ChainstampClient } from '@bamzzstudio/chainstamps-sdk';

import { CONTRACTS, CONTRACT_ADDRESS, NETWORK } from '../config/contracts';

const MICROSTX_PER_STX = 1_000_000;

export interface OnChainFees {
  hash: number;
  stamp: number;
  tag: number;
}

const FALLBACK_FEES: OnChainFees = {
  hash: CONTRACTS.hashRegistry.fee,
  stamp: CONTRACTS.stampRegistry.fee,
  tag: CONTRACTS.tagRegistry.fee,
};

export const chainstampClient = new ChainstampClient({
  network: NETWORK,
  contractAddress: CONTRACT_ADDRESS,
  senderAddress: CONTRACT_ADDRESS,
  contractNames: {
    hash: CONTRACTS.hashRegistry.name,
    stamp: CONTRACTS.stampRegistry.name,
    tag: CONTRACTS.tagRegistry.name,
  },
});

let cachedFees: OnChainFees | null = null;
let inFlightFeeRequest: Promise<OnChainFees> | null = null;

const toMicroStx = (value: unknown): bigint | null => {
  if (typeof value === 'bigint' && value >= 0n) {
    return value;
  }

  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return BigInt(Math.floor(value));
  }

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return BigInt(value);
  }

  return null;
};

const toStx = (microStx: bigint): number => Number(microStx) / MICROSTX_PER_STX;

const resolveFee = (result: PromiseSettledResult<unknown>, fallback: number): number => {
  if (result.status !== 'fulfilled') {
    return fallback;
  }

  const rawValue = result.value;
  const resolvedValue =
    typeof rawValue === 'object' && rawValue !== null && 'value' in rawValue
      ? (rawValue as Record<string, unknown>).value
      : rawValue;

  const feeValue = toMicroStx(resolvedValue);
  if (feeValue === null) {
    return fallback;
  }

  return toStx(feeValue);
};

export const fetchOnChainFees = async (forceRefresh = false): Promise<OnChainFees> => {
  if (!forceRefresh && cachedFees) {
    return cachedFees;
  }

  if (!forceRefresh && inFlightFeeRequest) {
    return inFlightFeeRequest;
  }

  inFlightFeeRequest = (async () => {
    const [hashFee, stampFee, tagFee] = await Promise.allSettled([
      chainstampClient.getHashFee(),
      chainstampClient.getStampFee(),
      chainstampClient.getTagFee(),
    ]);

    const nextFees: OnChainFees = {
      hash: resolveFee(hashFee, FALLBACK_FEES.hash),
      stamp: resolveFee(stampFee, FALLBACK_FEES.stamp),
      tag: resolveFee(tagFee, FALLBACK_FEES.tag),
    };

    cachedFees = nextFees;
    inFlightFeeRequest = null;
    return nextFees;
  })().catch(error => {
    inFlightFeeRequest = null;
    throw error;
  });

  return inFlightFeeRequest;
};

export const clearFeeCache = (): void => {
  cachedFees = null;
  inFlightFeeRequest = null;
};

/**
 * Returns true when there is a valid in-memory fee cache available.
 */
export const isFeesCached = (): boolean => cachedFees !== null;

/** Timestamp (ms) of the most recent successful fee fetch, or null if never fetched. */
let lastFeesFetchedAt: number | null = null;

/**
 * Returns the age of the current fees cache in milliseconds,
 * or null if fees have never been successfully fetched.
 */
export const getFeesAge = (): number | null =>
  lastFeesFetchedAt !== null ? Date.now() - lastFeesFetchedAt : null;
