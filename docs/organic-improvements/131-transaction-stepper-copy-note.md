# Transaction Stepper Copy

## Summary
Transaction steppers should keep signing, broadcast, and confirmation states distinct.

## Checks
- Test wallet cancel, broadcast success, and delayed confirmation.
- Confirm each step has a stable label.
- Capture one delayed confirmation during smoke testing.
