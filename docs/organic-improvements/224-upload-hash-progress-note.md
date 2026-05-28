# Upload Hash Progress Note

## Summary
Upload hashing QA should confirm users can tell whether a file is hashing locally or waiting on wallet action.

## Checks
- Test a small file and a file near the supported size limit.
- Confirm progress copy does not imply the file is being uploaded if only the hash is used.
- Verify canceling before wallet confirmation leaves no partial stamp record.
- Recheck progress text when hashing runs in a background worker.
