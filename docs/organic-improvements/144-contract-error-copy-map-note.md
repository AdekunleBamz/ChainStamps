# Contract Error Copy Map

## Summary
Contract errors should map to specific, user-readable copy before release.

## Checks
- Compare common error codes with `docs/CONTRACT_ERRORS.md`.
- Test at least one rejected write path.
- Record unmapped errors for follow-up.
