# Transaction Status Polling Backoff

- Apply stepped polling intervals for long-pending transactions.
- Reduce polling frequency after the initial confirmation window.
- This lowers RPC pressure while maintaining visibility.
