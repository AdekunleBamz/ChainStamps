# Security Considerations

This document outlines security guidance when using ChainStamps.

## On-Chain Data Visibility
- All on-chain data is public and permanent.
- Store hashes (not sensitive data) when verifying documents.
- Avoid including personally identifiable information in stamps or tags.

## Fee Protection
- Contract fees prevent spam, but do not replace rate limiting in clients.
- Client apps should enforce local validation (length checks, input sanitation).

## Key Management
- Never expose private keys in client-side code.
- Use secure wallets or server-side signing services.
- Rotate keys if compromise is suspected.

## Transaction Safety
- Validate contract addresses and network (testnet vs mainnet).
- Ensure you are interacting with the intended contract version.

## Data Integrity
- Always hash documents locally using a secure algorithm (SHA-256).
- Verify hashes are computed from raw file bytes, not formatted text.

## Client App Best Practices
- Add input validation (lengths, allowed characters).
- Provide clear user feedback for errors (e.g., insufficient funds).
- Implement retries for broadcast failures or temporary API issues.

## Monitoring
- Use Stacks API to monitor transactions and confirmations.
- Track contract fees and usage for anomaly detection.

## Incident Response
- If a bug is found, open a GitHub issue or report via SECURITY.md.
- Consider pausing new releases until a fix is deployed.
