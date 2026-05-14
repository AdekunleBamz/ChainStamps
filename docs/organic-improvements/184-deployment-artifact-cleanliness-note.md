# Deployment Artifact Cleanliness

## Summary
Deployment metadata and build outputs should stay out of commits unless intentionally tracked.

## Checks
- Inspect git status after production builds.
- Leave local deployment metadata uncommitted.
- Document any intentional generated artifact.
