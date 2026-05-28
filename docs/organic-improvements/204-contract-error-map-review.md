# Contract Error Map Review

## Summary
Frontend error maps should be reviewed whenever contract error codes are documented.

## Checks
- Compare UI copy against `docs/CONTRACT_ERRORS.md`.
- Keep fallback copy for unknown `(err u###)` responses.
- Include network and function name in bug reports.
- Recheck mappings after adding new registry contract functions.
