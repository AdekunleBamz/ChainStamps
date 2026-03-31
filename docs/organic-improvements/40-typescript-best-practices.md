# TypeScript Best Practices

**Date:** 2026-03-31  
**Author:** Adekunle Bamz (@adekunlebamz)

## Overview

This note documents TypeScript best practices followed in ChainStamps.

## Type Safety

### Prefer Interfaces for Props
```typescript
interface ButtonProps extends HTMLMotionProps<'button'> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}
```

### Use Utility Types
- `Partial<T>` - Make all properties optional
- `Required<T>` - Make all properties required
- `Pick<T, K>` - Select specific properties
- `Omit<T, K>` - Exclude specific properties

### Strict Mode
- `strict: true` enabled in tsconfig
- `noImplicitAny: true`
- `strictNullChecks: true`

## Related Files

- `frontend/tsconfig.json` - TypeScript configuration
- `frontend/src/components/ui/Button.tsx` - Example component