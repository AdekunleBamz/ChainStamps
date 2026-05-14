# Contract Read Timeout

## Summary
Readonly contract calls should show a recoverable timeout state instead of a blank panel.

## Checks
- Simulate slow API response.
- Confirm retry and stale-data labels are visible.
- Note the timeout threshold in release review.
