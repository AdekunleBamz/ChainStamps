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

  useEffect(() => {
    let cancelled = false;

    const syncOnChainFees = async () => {
      try {
        const nextFees = await fetchOnChainFees();
        if (!cancelled && nextFees && typeof nextFees === 'object') {
          setFees(nextFees);
        }
      } catch {
        // Silent fallback to static fee config.
      }
    };

    syncOnChainFees();

    return () => {
      cancelled = true;
    };
  }, []);

  return { fees };
};
