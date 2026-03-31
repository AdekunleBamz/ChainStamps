# Wallet Integration Notes

**Date:** 2026-03-31  
**Author:** Adekunle Bamz  
**Type:** Integration Guide

## Overview

This document outlines the wallet integration patterns used in ChainStamps for connecting users to the Stacks blockchain.

## Supported Wallets

### Hiro Wallet
- Browser extension for Chrome, Firefox, Brave
- Most widely used Stacks wallet
- Supports both testnet and mainnet

### Xverse Wallet
- Mobile and desktop applications
- Growing adoption in the Stacks ecosystem
- Excellent mobile experience

## Connection Flow

1. User clicks "Connect Wallet" button
2. Application calls `showConnect()` from @stacks/connect
3. User selects their preferred wallet
4. Wallet prompts for authentication
5. Application receives user session data
6. Session is stored for subsequent interactions

## Code Pattern

```typescript
import { showConnect } from '@stacks/connect';

const appDetails = {
  name: 'ChainStamps',
  icon: window.location.origin + '/logo.png'
};

showConnect({
  appDetails,
  onFinish: (data) => {
    // Handle successful connection
    console.log('Connected:', data);
  },
  onCancel: () => {
    // Handle user cancellation
    console.log('Connection cancelled');
  }
});
```

## Best Practices

- Always provide clear feedback during connection
- Handle connection errors gracefully
- Store session securely
- Support wallet switching
- Test on both testnet and mainnet

## Related Documents

- [SDK Examples](../SDK_EXAMPLES.md)
- [Troubleshooting](../TROUBLESHOOTING.md)