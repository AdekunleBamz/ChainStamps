# Explorer Network Link

## Summary
Explorer links should preserve the target network so pending transactions open in the correct view.

## Checks
- Include `chain=testnet` for testnet links.
- Use mainnet links only for mainnet transactions.
- Recheck explorer URLs during release smoke tests.
