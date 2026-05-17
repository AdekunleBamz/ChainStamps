# Contract Read Retry Note

## Summary
Contract read retries should be documented before stale stamp or registry data is treated as a product bug.

## Checks
- Retry the read after a fresh block confirms.
- Compare registry data from the app with a direct contract read.
- Include the endpoint host and block height when retry evidence differs.
