import { useState, useCallback } from 'react';

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
export const useHashing = () => {
  const [hash, setHash] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const computeHash = useCallback(async (file: File) => {
    setIsHashing(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
      return hashHex;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
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
