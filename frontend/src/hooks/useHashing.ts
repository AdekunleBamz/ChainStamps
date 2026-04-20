import { useState, useCallback } from 'react';

/** Hash algorithm identifier used for file fingerprinting. */
const HASH_ALGORITHM = 'SHA-256';

/**
 * Extracts a user-friendly error message from an unknown error.
 * 
 * @param {unknown} err - The error to extract message from
 * @returns {string} A human-readable error message
 */
const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Failed to compute file hash';

/**
 * Custom hook for computing SHA-256 hashes of files.
 * 
 * @returns {Object} Hashing state and the computeHash function.
 * @property {string|null} hash - The computed hex string of the file.
 * @property {boolean} isHashing - Loading state during computation.
 * @property {string|null} error - Error message if hashing fails.
 * @property {function} computeHash - Function to start hashing a File object.
 */
export const useHashing = (): {
  hash: string | null;
  isHashing: boolean;
  error: string | null;
  computeHash: (file: File) => Promise<string>;
  resetHash: () => void;
} => {
  const [hash, setHash] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const computeHash = useCallback(async (file: File) => {
    if (!(file instanceof File) || file.size === 0) {
      throw new Error('A valid non-empty file is required');
    }
    setIsHashing(true);
    setError(null);
    try {
      if (!globalThis.crypto?.subtle) {
        throw new Error('Web Crypto API is not available in this environment');
      }
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
      return hashHex;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setHash(null);
      setError(msg);
      throw err;
    } finally {
      setIsHashing(false);
    }
  }, []);

  /**
   * Resets the hashing state, clearing any computed hash or error.
   */
  const resetHash = useCallback(() => {
    setHash(null);
    setError(null);
    setIsHashing(false);
  }, []);

  return {
    hash,
    isHashing,
    error,
    computeHash,
    resetHash
  };
};
