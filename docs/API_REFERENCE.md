# API Reference

Complete API documentation for all ChainStamps smart contracts.

## Table of Contents

- [Hash Registry](#hash-registry)
- [Stamp Registry](#stamp-registry)
- [Tag Registry](#tag-registry)
- [Error Codes](#error-codes)

---

## Hash Registry

Contract for storing and verifying document hashes on-chain.

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `HASH-FEE` | 30000 µSTX | Fee to store a hash (0.03 STX) |
| `CONTRACT-OWNER` | `tx-sender` | Deployer address |

### Public Functions

#### `store-hash`

Store a document hash on-chain.

```clarity
(define-public (store-hash (hash (buff 32)) (description (string-utf8 128))))
```

**Parameters:**
- `hash` - 32-byte buffer (SHA-256 hash of document)
- `description` - UTF-8 string up to 128 characters

**Returns:** `(response uint uint)` - Hash ID on success

**Errors:**
- `u101` - Hash already exists
- Transfer error if insufficient funds

---

#### `verify-owner`

Verify caller is contract owner.

```clarity
(define-public (verify-owner))
```

**Returns:** `(response bool uint)`

**Errors:**
- `u100` - Not authorized

---

### Read-Only Functions

#### `get-hash-info`

Get full metadata for a hash.

```clarity
(define-read-only (get-hash-info (hash (buff 32))))
```

**Returns:** `(optional {owner, description, timestamp, block-height, hash-id})`

---

#### `verify-hash`

Check if a hash exists.

```clarity
(define-read-only (verify-hash (hash (buff 32))))
```

**Returns:** `bool`

---

#### `get-hash-count`

Get total number of stored hashes.

```clarity
(define-read-only (get-hash-count))
```

**Returns:** `uint`

---

#### `get-user-hashes`

Get all hashes stored by a user.

```clarity
(define-read-only (get-user-hashes (user principal)))
```

**Returns:** `(list 100 (buff 32))`

---

#### `get-hash-by-id`

Get hash by its ID.

```clarity
(define-read-only (get-hash-by-id (id uint)))
```

**Returns:** `(optional (buff 32))`

---

#### `get-hash-fee`

Get current hash storage fee.

```clarity
(define-read-only (get-hash-fee))
```

**Returns:** `uint` (30000)

---

## Stamp Registry

Contract for permanently stamping messages on-chain.

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `STAMP-FEE` | 50000 µSTX | Fee to stamp a message (0.05 STX) |
| `MAX-MESSAGE-LENGTH` | 256 | Maximum message length |

### Public Functions

#### `stamp-message`

Stamp a message on-chain.

```clarity
(define-public (stamp-message (message (string-utf8 256))))
```

**Parameters:**
- `message` - UTF-8 string up to 256 characters

**Returns:** `(response uint uint)` - Stamp ID on success

**Errors:**
- `u101` - Message too long
- Transfer error if insufficient funds

---

### Read-Only Functions

#### `get-stamp`

Get stamp by ID.

```clarity
(define-read-only (get-stamp (stamp-id uint)))
```

**Returns:** `(optional {sender, message, timestamp, block-height})`

---

#### `get-stamp-count`

Get total number of stamps.

```clarity
(define-read-only (get-stamp-count))
```

**Returns:** `uint`

---

#### `get-user-stamps`

Get all stamps by a user.

```clarity
(define-read-only (get-user-stamps (user principal)))
```

**Returns:** `(list 100 uint)`

---

#### `get-stamp-fee`

Get current stamp fee.

```clarity
(define-read-only (get-stamp-fee))
```

**Returns:** `uint` (50000)

---

## Tag Registry

Contract for storing updateable key-value pairs.

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `TAG-FEE` | 40000 µSTX | Fee per tag operation (0.04 STX) |
| `MAX-KEY-LENGTH` | 64 | Maximum key length |
| `MAX-VALUE-LENGTH` | 256 | Maximum value length |

### Public Functions

#### `store-tag`

Store a new key-value tag.

```clarity
(define-public (store-tag (key (string-utf8 64)) (value (string-utf8 256))))
```

**Parameters:**
- `key` - UTF-8 string up to 64 characters
- `value` - UTF-8 string up to 256 characters

**Returns:** `(response uint uint)` - Tag ID on success

---

#### `update-tag`

Update an existing tag's value.

```clarity
(define-public (update-tag (key (string-utf8 64)) (new-value (string-utf8 256))))
```

**Parameters:**
- `key` - Existing key to update
- `new-value` - New value

**Returns:** `(response uint uint)` - Tag ID on success

**Errors:**
- `u103` - Tag not found

---

### Read-Only Functions

#### `get-tag`

Get tag by ID.

```clarity
(define-read-only (get-tag (tag-id uint)))
```

**Returns:** `(optional {owner, key, value, timestamp, block-height})`

---

#### `get-tag-by-key`

Get tag by owner and key.

```clarity
(define-read-only (get-tag-by-key (owner principal) (key (string-utf8 64))))
```

**Returns:** `(optional {owner, key, value, timestamp, block-height})`

---

#### `get-tag-count`

Get total number of tags.

```clarity
(define-read-only (get-tag-count))
```

**Returns:** `uint`

---

#### `get-user-tags`

Get all tags by a user.

```clarity
(define-read-only (get-user-tags (user principal)))
```

**Returns:** `(list 100 uint)`

---

#### `get-tag-fee`

Get current tag fee.

```clarity
(define-read-only (get-tag-fee))
```

**Returns:** `uint` (40000)

---

## Error Codes

### Common Errors

| Code | Constant | Description |
|------|----------|-------------|
| u100 | ERR-NOT-AUTHORIZED | Caller is not authorized |
| u101 | ERR-*-TOO-LONG | Input exceeds maximum length |
| u102 | ERR-INSUFFICIENT-PAYMENT | Not enough STX sent |
| u103 | ERR-*-NOT-FOUND | Resource not found |

### Hash Registry Specific

| Code | Constant | Description |
|------|----------|-------------|
| u101 | ERR-HASH-ALREADY-EXISTS | Hash already stored |
| u102 | ERR-HASH-NOT-FOUND | Hash not found |

### Stamp Registry Specific

| Code | Constant | Description |
|------|----------|-------------|
| u101 | ERR-MESSAGE-TOO-LONG | Message exceeds 256 chars |
| u103 | ERR-STAMP-NOT-FOUND | Stamp ID not found |

### Tag Registry Specific

| Code | Constant | Description |
|------|----------|-------------|
| u101 | ERR-KEY-TOO-LONG | Key exceeds 64 chars |
| u102 | ERR-VALUE-TOO-LONG | Value exceeds 256 chars |
| u103 | ERR-TAG-NOT-FOUND | Tag not found |
