import { useState, useCallback } from 'react';

/**
 * Custom hook for computing SHA-256 hashes of files.
 * Handles the async hashing process and provides status, hash, and error state.
 * 
 * @returns {Object} Hashing state and compute function.
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
    } catch (err: any) {
      const msg = err.message || 'Failed to compute file hash';
      setError(msg);
      throw err;
    } finally {
      setIsHashing(false);
    }
  }, []);

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
