# Clipboard Copy Timeout Note

## Summary
Clipboard copy QA should cover browsers that delay or deny clipboard access for proof and explorer links.

## Checks
- Test copy actions in at least one Chromium and one Safari-based browser.
- Confirm denied clipboard access leaves the link visible for manual copy.
- Record whether the copied value was a proof link, hash, or transaction ID.
