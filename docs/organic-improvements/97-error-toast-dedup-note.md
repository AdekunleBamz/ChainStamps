# Error Toast Deduplication

- Deduplicate repeated error toasts for identical failure causes.
- Increment a small retry counter inside the toast when repeats occur.
- This keeps notifications informative without flooding users.
