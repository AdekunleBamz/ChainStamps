# Component Testing Strategies

**Date:** 2026-03-31  
**Author:** Adekunle Bamz (@adekunlebamz)

## Overview

This note outlines testing strategies for React components in ChainStamps.

## Testing Pyramid

### Unit Tests
- Test individual utility functions
- Test custom hooks in isolation
- Test pure components with mocked props

### Integration Tests
- Test component interactions
- Test context providers with consumers
- Test form submissions and state updates

### E2E Tests
- Test complete user workflows
- Test wallet connection flows
- Test transaction submissions

## Tools Used

- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **Mock Service Worker**: API mocking for integration tests

## Best Practices

1. Test behavior, not implementation
2. Use accessibility queries (getByRole, getByLabelText)
3. Mock external dependencies (wallet, network)
4. Test error states and edge cases

## Related Files

- `frontend/src/components/Registry.test.tsx` - Component test example
- `vitest.config.ts` - Test configuration