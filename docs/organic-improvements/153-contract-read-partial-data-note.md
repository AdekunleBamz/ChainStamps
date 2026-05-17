# Contract Read Partial Data

## Summary
Registry views should show partial data gracefully when one contract read fails.

## Checks
- Simulate one failed registry read while others succeed.
- Confirm available records remain visible.
- Add a retry action for the affected section.
