# Transaction Stepper Retry Copy

## Summary
Transaction steppers should tell users whether retry repeats signing or only refreshes status.

## Checks
- Test retries before and after wallet approval.
- Confirm retry buttons are disabled during active wallet prompts.
- Keep raw tx id visible during status refresh.
