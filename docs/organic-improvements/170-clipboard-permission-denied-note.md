# Clipboard Permission Denied

## Summary
Copy actions should recover when browser clipboard permission is denied.

## Checks
- Deny clipboard permissions and retry copy actions.
- Confirm the fallback text can still be selected manually.
- Keep success and failure messages visually distinct.
