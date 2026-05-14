# Release Artifact Cleanliness

## Summary
After production builds, keep generated artifacts and local deployment metadata out of commits.

## Checks
- Inspect git status before finalizing release commits.
- Leave `dist/`, local env files, and deployment metadata uncommitted.
- Document any intentional generated artifact in release notes.
