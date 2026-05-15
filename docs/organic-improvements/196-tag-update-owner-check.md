# Tag Update Owner Check

## Summary
Tag update troubleshooting should confirm the connected wallet owns the tag before retrying.

## Checks
- Compare owner principal and connected address.
- Use the same network for read and write checks.
- Surface owner mismatch copy before opening the wallet prompt.
