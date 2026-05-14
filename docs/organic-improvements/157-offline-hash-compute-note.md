# Offline Hash Compute

## Summary
Hash computation can run offline, but write actions should clearly require network access.

## Checks
- Compute a hash while offline.
- Confirm stamp submission is blocked with clear copy.
- Recheck queued form state after reconnect.
