# ChainStamps 🔗📜

<div align="center">

![Clarity](https://img.shields.io/badge/Clarity-Smart%20Contracts-blue?style=for-the-badge)
![Stacks](https://img.shields.io/badge/Stacks-Blockchain-orange?style=for-the-badge)
![Bitcoin](https://img.shields.io/badge/Bitcoin-Secured-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Permanent on-chain document verification, message stamping, and key-value storage on Bitcoin's most secure layer.**

[Getting Started](#-getting-started) •
[Contracts](#-smart-contracts) •
[API Reference](#-api-reference) •
[Examples](#-usage-examples) •
[Contributing](#-contributing)

</div>

---

## 📋 Overview

ChainStamps is a Clarity smart contract suite for the Stacks blockchain that enables:

- **📄 Document Verification** - Store SHA-256 hashes with metadata for permanent proof of existence
- **💬 Message Stamping** - Permanently record messages on-chain with immutable timestamps
- **🏷️ Key-Value Storage** - Store and update configuration data or tags on the blockchain

All data is secured by Bitcoin's proof-of-work, providing the highest level of security for your on-chain records.

## ✨ Features

| Feature | Description | Fee |
|---------|-------------|-----|
| Hash Registry | Store document hashes with descriptions | 0.03 STX |
| Stamp Registry | Record permanent messages on-chain | 0.05 STX |
| Tag Registry | Store key-value pairs | 0.04 STX |

### Key Capabilities

- ✅ **Immutable Records** - Once stored, data cannot be altered
- ✅ **Ownership Verification** - Only owners can manage their records
- ✅ **Timestamp Proof** - Automatic block height and timestamp recording
- ✅ **User Tracking** - Query all records by user address
- ✅ **Low Fees** - Minimal STX cost per operation
- ✅ **Bitcoin Security** - Inherits Bitcoin's security through Stacks

## 🚀 Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) v2.0+
- [Node.js](https://nodejs.org/) v18+
- [Stacks Wallet](https://www.hiro.so/wallet) (for mainnet/testnet deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/ChainStamps.git
cd ChainStamps

# Install dependencies
npm install

# Run tests
npm test
```

### Local Development

```bash
# Start Clarinet console
clarinet console

# Run all tests with coverage
npm run test:report

# Watch mode for development
npm run test:watch
```

## 📜 Smart Contracts

### 1. Hash Registry (`hash-registry.clar`)

Store and verify document hashes on-chain.

```clarity
;; Store a document hash
(contract-call? .hash-registry store-hash 
    0x1234...abcd  ;; SHA-256 hash (32 bytes)
    u"My important document"  ;; Description
)

;; Verify a hash exists
(contract-call? .hash-registry verify-hash 0x1234...abcd)
;; Returns: true/false
```

### 2. Stamp Registry (`stamp-registry.clar`)

Permanently stamp messages on the blockchain.

```clarity
;; Stamp a message
(contract-call? .stamp-registry stamp-message 
    u"This message will exist forever on Bitcoin"
)

;; Retrieve a stamp
(contract-call? .stamp-registry get-stamp u1)
```

### 3. Tag Registry (`tag-registry.clar`)

Store updateable key-value pairs on-chain.

```clarity
;; Store a tag
(contract-call? .tag-registry store-tag 
    u"version"
    u"1.0.0"
)

;; Update a tag
(contract-call? .tag-registry update-tag 
    u"version"
    u"2.0.0"
)

;; Get tag by key
(contract-call? .tag-registry get-tag-by-key tx-sender u"version")
```

## 📚 API Reference

### Hash Registry

| Function | Type | Description |
|----------|------|-------------|
| `store-hash` | Public | Store a new hash with description |
| `verify-hash` | Read-only | Check if hash exists |
| `get-hash-info` | Read-only | Get full hash metadata |
| `get-hash-count` | Read-only | Total hashes stored |
| `get-user-hashes` | Read-only | Get all hashes by user |
| `get-hash-fee` | Read-only | Current fee (30000 µSTX) |

### Stamp Registry

| Function | Type | Description |
|----------|------|-------------|
| `stamp-message` | Public | Stamp a new message |
| `get-stamp` | Read-only | Get stamp by ID |
| `get-stamp-count` | Read-only | Total stamps created |
| `get-user-stamps` | Read-only | Get all stamps by user |
| `get-stamp-fee` | Read-only | Current fee (50000 µSTX) |

### Tag Registry

| Function | Type | Description |
|----------|------|-------------|
| `store-tag` | Public | Store a new key-value tag |
| `update-tag` | Public | Update existing tag value |
| `get-tag` | Read-only | Get tag by ID |
| `get-tag-by-key` | Read-only | Get tag by owner + key |
| `get-tag-count` | Read-only | Total tags stored |
| `get-user-tags` | Read-only | Get all tags by user |
| `get-tag-fee` | Read-only | Current fee (40000 µSTX) |

## 💡 Usage Examples

### Document Notarization

```javascript
import { openContractCall } from '@stacks/connect';
import { bufferCV, stringUtf8CV } from '@stacks/transactions';
import { sha256 } from 'js-sha256';

// Hash your document
const documentContent = "Important legal document content...";
const hash = sha256.array(documentContent);

// Store on-chain
await openContractCall({
    contractAddress: 'SP...',
    contractName: 'hash-registry',
    functionName: 'store-hash',
    functionArgs: [
        bufferCV(new Uint8Array(hash)),
        stringUtf8CV('Legal Document v1.0')
    ]
});
```

### Timestamped Announcements

```javascript
// Stamp an official announcement
await openContractCall({
    contractAddress: 'SP...',
    contractName: 'stamp-registry',
    functionName: 'stamp-message',
    functionArgs: [
        stringUtf8CV('🎉 Product v2.0 officially launched!')
    ]
});
```

### Configuration Storage

```javascript
// Store app configuration on-chain
await openContractCall({
    contractAddress: 'SP...',
    contractName: 'tag-registry',
    functionName: 'store-tag',
    functionArgs: [
        stringUtf8CV('api-endpoint'),
        stringUtf8CV('https://api.myapp.com/v2')
    ]
});
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:report

# Watch mode
npm run test:watch
```

### Test Coverage

All contracts include comprehensive tests for:
- ✅ Basic functionality
- ✅ Fee collection
- ✅ User tracking
- ✅ Error handling
- ✅ Access control

## 🗺️ Deployment

### Testnet

```bash
clarinet deployments apply --testnet
```

### Mainnet

```bash
clarinet deployments apply --mainnet
```

## 📁 Project Structure

```
ChainStamps/
├── contracts/
│   ├── hash-registry.clar    # Document hash storage
│   ├── stamp-registry.clar   # Message stamping
│   └── tag-registry.clar     # Key-value storage
├── tests/
│   ├── hash-registry.test.ts
│   ├── stamp-registry.test.ts
│   └── tag-registry.test.ts
├── deployments/
│   ├── default.mainnet-plan.yaml
│   └── default.simnet-plan.yaml
├── Clarinet.toml
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)

---

<div align="center">

**Built with ❤️ on Stacks**

*Secured by Bitcoin*

</div>
