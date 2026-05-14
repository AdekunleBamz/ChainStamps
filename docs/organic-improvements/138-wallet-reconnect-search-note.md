# Wallet Reconnect Search

## Summary
Search and history filters should survive wallet reconnect only when the network stays the same.

## Checks
- Reconnect on the same network and then a different network.
- Confirm stale filters are cleared after network switch.
- Record expected filter persistence in support docs.
