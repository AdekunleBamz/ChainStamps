# Readonly Query Retry Cap

## Summary
Readonly registry queries should cap retries and offer a manual retry after repeated failures.

## Checks
- Simulate repeated read failures.
- Confirm error states do not spin forever.
- Keep retry copy separate from write-action errors.
