# Hash Upload Failure

## Summary
File hash failures should explain whether hashing, file size, or browser permission caused the error.

## Checks
- Test oversized, empty, and unreadable files.
- Confirm retry copy does not ask users to re-sign.
- Include browser name in failure reports.
