# RPC Fallback Disclosure

## Summary
Fallback RPC behavior should be visible during QA so wrong-network reads are easy to spot.

## Checks
- Force the primary endpoint to fail.
- Confirm the fallback endpoint uses the same network.
- Log endpoint names without exposing secret tokens.
