# ChainStamps 🔗📜

ChainStamps is a decentralized application for permanent on-chain document verification, message stamping, and key-value storage. Built on the Stacks blockchain and secured by Bitcoin, it provides an immutable and trustworthy way to store and verify information.

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/ChainStamps.git
cd ChainStamps

# Install dependencies
npm ci
npm --prefix frontend ci

# Start the development server
npm --prefix frontend run dev
```

For prerequisites, environment setup, and contract workflows, see the [Detailed Setup](#-detailed-setup) section below.

<div align="center">

![Clarity](https://img.shields.io/badge/Clarity-Smart%20Contracts-blue?style=for-the-badge)
![Stacks](https://img.shields.io/badge/Stacks-Blockchain-orange?style=for-the-badge)
![Bitcoin](https://img.shields.io/badge/Bitcoin-Secured-yellow?style=for-the-badge)
![Mission](https://img.shields.io/badge/Mission-Open%20Source-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Permanent on-chain document verification, message stamping, and key-value storage on Bitcoin's most secure layer.**

[Getting Started](#-getting-started) •
[Contracts](#-smart-contracts) •
[API Reference](#-api-reference) •
[Documentation](./docs/INDEX.md) •
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

## ✨ Key Features

- **🔐 Secure Stamping**: Permanent on-chain document verification secured by Bitcoin.
- **🏷️ Tag Registry**: flexible key-value storage for decentralized metadata.
- **⚡ Low Cost**: Optimized Clarity contracts for minimal micro-STX (uSTX) fees.
- **🌐 Open API**: Easy integration for developers and external dApps.

## Architecture & DX

ChainStamps follows a modern React architecture with:
- **Shared UI Layer**: Decoupled, reusable components (Button, SuccessMessage, etc.).
- **Logic Hooks**: Isolated state management for hashing and contract calls.
- **Strict Documentation**: Comprehensive JSDoc coverage for all core features.
- **Performance Optimized**: GPU-accelerated animations, throttled event listeners, and memoized components.

### Developer Flow
1. **Connect**: Wallet connection integration for Stacks mainnet.
2. **Interact**: Declarative hooks handle transaction lifecycles.
3. **Verify**: Direct links to Stacks Explorer for all on-chain actions.
4. **Audit**: Real-time performance monitoring via `PerformanceOverlay`.

## ✨ Features

| Feature | Description | Fee |
|---------|-------------|-----|
| Hash Registry | Store document hashes with descriptions | 0.03 STX |
| Stamp Registry | Stamp short messages with on-chain timestamps | 0.05 STX |
| Tag Registry | Store key-value pairs | 0.04 STX |

> [!NOTE]
> All fees are paid in micro-STX (uSTX). 1 STX = 1,000,000 uSTX. Fees are collected by the contract and secured on-chain.

### Technical Stack

- **Blockchain**: [Stacks (L2)](https://stacks.co) - Enabling smart contracts on Bitcoin
- **Smart Contracts**: [Clarity](https://docs.stacks.co/clarity) - A LISP-like, interpreted language that is decidable and prevents common smart contract vulnerabilities like re-entrancy.
- **Security Layer**: **Bitcoin** - All transactions are settled on Bitcoin via the [Proof-of-Transfer (PoX)](https://docs.stacks.co/concepts/proof-of-transfer) consensus mechanism.
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Tooling**: Clarinet, Vitest

### Key Capabilities

- ✅ **Immutable Records** - Once stored, data cannot be altered, inheriting Bitcoin's immutability
- ✅ **Ownership Verification** - Only owners can manage their records through cryptographic signatures
- ✅ **Timestamp Proof** - Automatic block height recording on the Bitcoin-secured Stacks layer
- ✅ **User Tracking** - Query all records by user address
- ✅ **Low Fees** - Minimal STX cost per operation
- ✅ **Bitcoin Security** - Inherits Bitcoin's security through Stacks

## 🚀 Detailed Setup

### Prerequisites
- Node.js 20+
- npm 10+
- Clarinet CLI

### Environment Setup

1. **Wallet**: Install the [Hiro Wallet](https://www.hiro.so/wallet) or [Xverse](https://www.xverse.app/).
2. **Network**: Switch to `Mainnet` for live transactions or `Devnet` for local testing.
3. **STX**: Ensure you have a small amount of STX for transaction fees (see the [Features fee table](#-features)).

### Installation

```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/ChainStamps.git
cd ChainStamps

# Install dependencies
npm ci
npm --prefix frontend ci

# Run tests
npm run test

# Run focused fee utility tests
npm run test:fee
```

### Local Development

```bash
# Start Clarinet console
clarinet console

# Run all tests with coverage
npm run test:report

# Run a fast pre-push check (contracts + focused fee tests)
npm run check:fast

# Start frontend dev server
npm run frontend:dev
```

### Development Workflow

1.  **Code**: Write Clarity contracts in `contracts/`.
2.  **Test**: Run `npm test` to verify contract behavior.
3.  **Frontend**: Update React components in `frontend/src/`.
4.  **Verify**: Run `npm run frontend:lint` and `npm run check:fast`.
5.  **Deploy**: Use `clarinet deployments apply`.

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

#### Technical Format
- **Algorithm**: SHA-256.
- **Input**: 32-byte hash (prefixed with `0x`).
- **Storage**: Maps uniquely to `tx-sender`.
- **Integrity**: Verified via block height on-chain.

#### Data Integrity
ChainStamps ensures data integrity by:
1.  **Client-side Hashing**: Files never leave your browser; only their SHA-256 fingerprint is sent on-chain.
2.  **Consensus Verification**: Stacks miners verify transaction validity before committing to a block.
3.  **Bitcoin Settlement**: Once confirmed, the data is anchored to the Bitcoin blockchain, making it virtually impossible to reverse.

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

### 🛡️ Smart Contract Security

All Clarity contracts have been designed with security as a priority:
-   **Post-conditions**: Every transaction uses post-conditions to ensure STX only leaves the wallet if the action succeeds.
-   **Overflow Protection**: Clarity's built-in overflow checks prevent common integer vulnerabilities.
-   **Decidability**: The language structure allows for formal verification of contract behavior.

### 3. Tag Registry (`tag-registry.clar`)

Store updatable key-value pairs on-chain.

```clarity
;; Store a tag
(contract-call? .tag-registry store-tag 
    u"version"
    u"1.0.0"
)

;; Update a tag
;; Note: update-tag expects the existing key (not a numeric tag ID)
(contract-call? .tag-registry update-tag 
    u"version"
    u"2.0.0"
)

;; Get tag by key
(contract-call? .tag-registry get-tag-by-key tx-sender u"version")
```

#### Common Use Cases for Tags
-   `profile-name`: Decentralized identity naming.
-   `app-version`: On-chain version tracking.
-   `metadata-url`: Links to off-chain assets (e.g., IPFS).
-   `verification-status`: Dynamic proof of status.

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
| `get-tag-by-key` | Read-only | Get full tag tuple by owner + key |
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

### Wallet Integration

ChainStamps uses the `@stacks/connect` library for seamless wallet integration. It supports both Hiro and Xverse wallets across browser extensions and mobile apps.

#### Connection Flow
1. User clicks **Connect Wallet**.
2. Application requests authentication via `showConnect`.
3. User signs the authentication request.
4. Application stores the session for subsequent contract calls.

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:report

# Build frontend bundle
npm run frontend:build

# Watch mode
npm run test:watch
```

### Test Coverage

All contracts include comprehensive tests for:
- ✅ Access control
- ✅ Fee accounting
- ✅ Optional read-only lookups
- ✅ Multi-user isolation

### Troubleshooting

-   **Transaction Pending**: Stacks transactions can take 10-20 minutes to settle on Bitcoin. Check the [Explorer](https://explorer.stacks.co/) for status.
-   **Contract Not Found**: Ensure you are on the correct network (Mainnet vs Testnet) in your wallet.
-   **Insufficient Fees**: Ensure you have enough STX to cover the contract fee + network tip.

Testing layers:
1.  **Unit Tests**: Logic verification with `clarinet test`.
2.  **Integration Tests**: Contract calling via `stacks-transactions`.
3.  **UI Testing**: Component-level tests with Vitest + React Testing Library.
4.  **Coverage**: Target 100% logic coverage for Clarity contracts.

## 🗺️ Deployment

### Testnet

```bash
clarinet deployments apply --testnet
```

### Mainnet

```bash
clarinet deployments apply --mainnet
```

### 📋 Deployment Checklist

Before deploying to mainnet, ensure:
1.  **Tests**: All `npm test` and `npm --prefix frontend run lint` checks pass.
2.  **Fees**: Wallet has sufficient STX (approx. 0.1 STX recommended).
3.  **Network**: Stacks node is synced and reachable.
4.  **Metadata**: `package.json` and `Clarinet.toml` versions are aligned.

## 🗺️ Roadmap

-   [ ] **Q2 2026**: Multi-signature support for Tag Registry.
-   [ ] **Q3 2026**: Integration with Hiro Wallet mobile.
-   [ ] **Q4 2026**: Decentralized storage integration (IPFS/Arweave).
-   [ ] **Q1 2027**: Cross-chain verification bridge.

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

### Frontend Architecture

-   **State Management**: React Context for Wallet and Toast states.
-   **Routing**: Client-side routing for seamless navigation.
-   **Animations**: Framer Motion for smooth transitions and state changes.
-   **Styling**: Modern CSS with Tailwind-like utility patterns for consistent UI.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For support, questions, or collaboration, please reach out to the project maintainer:
-   **Maintainer**: Adekunle Bamz
-   **GitHub**: [@AdekunleBamz](https://github.com/AdekunleBamz)
-   **Website**: [ChainStamps Live](https://chainstamp.vercel.app/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)

## 🎯 Project Vision

ChainStamps aims to bridge the gap between complex blockchain protocols and everyday document security. Our goal is to provide a user-friendly interface for Bitcoin's most powerful security features, making on-chain verification accessible to everyone.

## 🛡️ Data Privacy

-   **Public Data**: All data stored via ChainStamps is public and permanent on the Stacks blockchain.
-   **No PII**: Avoid storing Personally Identifiable Information (PII) on-chain.
-   **Hashing**: For sensitive documents, only store the SHA-256 hash to prove existence without revealing content.

## ♿ Accessibility

ChainStamps is committed to inclusive design:
-   **ARIA Labels**: All interactive elements include descriptive ARIA labels.
-   **Live Regions**: Dynamic updates (e.g., character counts) use `aria-live` for screen readers.
-   **Focus Management**: Clear focus indicators and logical tab order.
-   **Semantic HTML**: Header hierarchy and landmark roles for better navigation.

## ⚡ Performance Optimization

ChainStamps is built for speed and efficiency:
-   **Vite**: Lightning-fast build and hot module replacement.
-   **Code Splitting**: Dynamic imports for heavy components like `TransactionHistory`.
-   **Asset Optimization**: Minified CSS and optimized SVG icons for minimal payload.
-   **Caching**: Service worker caching for PWA reliability.
-   **Explorer Accuracy**: Review explorer-link network targets when deployment environments change.

---

<div align="center">

**Built with ❤️ on Stacks**

*Secured by Bitcoin*

</div>
