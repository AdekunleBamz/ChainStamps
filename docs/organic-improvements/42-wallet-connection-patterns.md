# Wallet Connection Patterns

**Date:** 2026-03-31  
**Author:** Adekunle Bamz (@adekunlebamz)

## Overview

This note documents wallet connection patterns used in ChainStamps.

## Supported Wallets

- Hiro Wallet
- Xverse Wallet

## Connection Flow

1. User clicks "Connect Wallet"
2. App requests authentication via @stacks/connect
3. User approves in wallet extension
4. App stores session for subsequent calls

## Error Handling

- Network errors: Retry with exponential backoff
- User rejection: Show friendly message
- Session expired: Prompt re-connection

## Related Files

- `frontend/src/context/WalletContext.tsx`
- `frontend/src/utils/walletconnect.ts`
