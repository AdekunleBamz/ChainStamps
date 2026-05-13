# Contract Read Stale Data

- Mark contract read results as stale when the latest refresh fails.
- Keep the last successful value visible with a timestamp.
- Avoid mixing stale read errors with transaction submission errors.
