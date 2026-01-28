# Troubleshooting

This guide helps resolve common issues when using ChainStamps.

## Transaction Errors

### Insufficient Funds
**Symptoms:** Transaction fails with insufficient funds.
**Fix:** Ensure you have enough STX for both contract fee and network fee.

### Contract Fee Mismatch
**Symptoms:** Transaction fails unexpectedly after broadcast.
**Fix:** Confirm the fee constants in the contract match what your client expects.

### Wrong Network
**Symptoms:** Transactions fail or appear missing.
**Fix:** Verify you are using testnet or mainnet consistently.

## API Issues

### API Unavailable
**Symptoms:** HTTP errors or timeouts when calling Stacks API.
**Fix:** Retry with exponential backoff or use an alternate API endpoint.

### Rate Limits
**Symptoms:** Too many requests errors.
**Fix:** Add caching, backoff, and reduce polling frequency.

## Data Verification

### Hash Not Found
**Symptoms:** `verify-hash` returns false for a known document.
**Fix:** Ensure you hashed the raw bytes and used SHA-256.

### Stamp Not Found
**Symptoms:** `get-stamp` returns none.
**Fix:** Confirm the stamp ID and network match.

## Development

### Tests Failing
**Symptoms:** `npm test` fails locally.
**Fix:** Ensure Clarinet is installed and dependencies are up to date.

### Build Errors
**Symptoms:** TypeScript or lint errors.
**Fix:** Run `npm install` and confirm Node.js version matches .nvmrc.

## Getting Help

- Open a GitHub issue with steps to reproduce
- Include transaction IDs and network details
- Reference error codes where applicable
