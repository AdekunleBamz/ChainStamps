# Haptic Feedback Patterns

**Date:** 2026-03-31  
**Author:** Adekunle Bamz (@adekunlebamz)

## Overview

This note documents the haptic feedback patterns implemented in ChainStamps for enhanced user experience.

## Implementation Details

### Vibration Patterns

The haptic system uses the Web Vibration API with the following patterns:

| Type | Pattern | Use Case |
|------|---------|----------|
| `light` | 10ms | Subtle button clicks, minor interactions |
| `medium` | 20ms | Standard button presses, form submissions |
| `heavy` | 50ms | Important actions, warnings |
| `success` | [10, 30, 10] | Successful transactions, completions |
| `error` | [50, 50, 50] | Failed operations, validation errors |

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Partial support (desktop only)
- Safari: No support (iOS vibration not exposed to web)

### Best Practices

1. **Don't overuse**: Haptics should enhance, not distract
2. **Provide fallbacks**: Visual feedback should always accompany haptics
3. **Respect user preferences**: Check for reduced motion preferences

## Related Files

- `frontend/src/utils/haptics.ts` - Core haptic utility
- `frontend/src/components/ui/Button.tsx` - Button component with haptic integration

## Future Improvements

- [ ] Add haptic intensity settings in user preferences
- [ ] Implement adaptive haptics based on device capabilities
- [ ] Add haptic patterns for loading states