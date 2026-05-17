# Readonly Query Timeout

## Summary
Readonly query failures should identify whether the API timed out or returned no records.

## Checks
- Distinguish timeout, not-found, and network mismatch states.
- Keep retry copy calm and specific.
- Capture endpoint and network in troubleshooting notes.
