# ChainStamps Contract Error Codes

[Back to Documentation Index](./INDEX.md)

This document lists error codes used across ChainStamps contracts for easier debugging.

## hash-registry

| Code | Constant | Meaning |
|------|----------|---------|
| u100 | ERR-NOT-AUTHORIZED | Caller is not authorized |
| u101 | ERR-HASH-ALREADY-EXISTS | Hash already exists |
| u102 | ERR-HASH-NOT-FOUND | Hash not found |
| u103 | ERR-TRANSFER-TO-SELF | Cannot transfer to self |

## stamp-registry

| Code | Constant | Meaning |
|------|----------|---------|
| u100 | ERR-NOT-AUTHORIZED | Caller is not authorized |
| u101 | ERR-MESSAGE-TOO-LONG | Message length exceeds max |
| u102 | ERR-INSUFFICIENT-PAYMENT | Payment or fee issue |
| u103 | ERR-STAMP-NOT-FOUND | Stamp not found |

## tag-registry

| Code | Constant | Meaning |
|------|----------|---------|
| u100 | ERR-NOT-AUTHORIZED | Caller is not authorized |
| u101 | ERR-KEY-TOO-LONG | Key length exceeds max |
| u102 | ERR-VALUE-TOO-LONG | Value length exceeds max |
| u103 | ERR-TAG-NOT-FOUND | Tag not found |
| u104 | ERR-KEY-ALREADY-EXISTS | Tag key already exists |

## Notes

- Error codes are returned as `(err u###)` in Clarity.
- For read-only calls, validate that you handle `none` responses where applicable.
- Keep frontend error maps in sync with this table whenever contract errors change.

Maintenance note: include txid and network context beside each reproduced error during triage.
