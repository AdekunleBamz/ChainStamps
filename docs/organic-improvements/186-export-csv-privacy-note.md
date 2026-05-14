# Export CSV Privacy

## Summary
CSV exports should avoid including private draft descriptions unless the user explicitly requests them.

## Checks
- Review exported fields for wallet and record views.
- Keep public tx ids distinct from private notes.
- Confirm empty exports still include safe headers.
