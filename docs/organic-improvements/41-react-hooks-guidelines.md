# React Hooks Guidelines

**Date:** 2026-03-31  
**Author:** Adekunle Bamz (@adekunlebamz)

## Overview

This note documents React hooks guidelines for ChainStamps.

## Custom Hooks

### useHashing
Computes SHA-256 hashes of files client-side.

### useContractCall
Handles contract call state management.

### useSearch
Provides filtering and search functionality.

## Best Practices

1. Always specify dependency arrays
2. Use useCallback for memoized functions
3. Use useMemo for expensive calculations
4. Clean up effects properly

## Related Files

- `frontend/src/hooks/useHashing.ts`
- `frontend/src/hooks/useContractCall.ts`
- `frontend/src/hooks/useSearch.ts`
