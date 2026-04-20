import { useEffect, useState } from 'react';

import { CONTRACTS } from '../config/contracts';
import { fetchOnChainFees, type OnChainFees } from '../sdk/chainstamp';

const DEFAULT_FEES: OnChainFees = {
  hash: CONTRACTS.hashRegistry.fee,
  stamp: CONTRACTS.stampRegistry.fee,
  tag: CONTRACTS.tagRegistry.fee,
};

export const useOnChainFees = () => {
  const [fees, setFees] = useState<OnChainFees>(DEFAULT_FEES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const syncOnChainFees = async (forceRefresh = false) => {
    try {
      const nextFees = await fetchOnChainFees(forceRefresh);
      if (nextFees && typeof nextFees === 'object') {
        setFees(nextFees);
        setLastFetched(Date.now());
        setIsLoaded(true);
      }
    } catch {
      // Silent fallback to static fee config.
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const fetchWithGuard = async () => {
      try {
        const nextFees = await fetchOnChainFees();
        if (!cancelled && nextFees && typeof nextFees === 'object') {
          setFees(nextFees);
          setLastFetched(Date.now());
          setIsLoaded(true);
        }
      } catch {
        if (!cancelled) setIsLoaded(true);
      }
    };
    fetchWithGuard();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshFees = () => syncOnChainFees(true);

  return { fees, isLoaded, lastFetched, refreshFees };
};
