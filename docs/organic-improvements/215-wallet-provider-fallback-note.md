# Wallet Provider Fallback Note

## Summary
Wallet fallback checks should confirm users get a useful next step when the preferred provider is unavailable.

## Checks
- Test with no wallet extension installed and with the extension disabled.
- Confirm fallback copy does not imply a transaction has already started.
- Record the browser and provider version when fallback behavior is inconsistent.
