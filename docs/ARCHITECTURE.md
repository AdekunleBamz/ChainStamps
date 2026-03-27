# ChainStamps Architecture

[Back to Documentation Index](./INDEX.md)

## Overview

ChainStamps is a decentralized timestamping and data storage platform built on the Stacks blockchain. It leverages Bitcoin's security through Stacks' proof-of-transfer (PoX) consensus mechanism.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                     │
│           (Web Apps, Mobile Apps, CLI Tools)                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Stacks.js SDK                            │
│         (Transaction Building, Signing, Querying)           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Stacks Blockchain                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│  hash-registry  │  stamp-registry │     tag-registry        │
│     Contract    │     Contract    │       Contract          │
└─────────────────┴─────────────────┴─────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Bitcoin Blockchain                        │
│              (Security & Finality Layer)                    │
└─────────────────────────────────────────────────────────────┘
```

## Smart Contract Architecture

### Contract Design Principles

1. **Simplicity**: Each contract handles one specific use case
2. **Transparency**: All data is publicly verifiable on-chain
3. **Immutability**: Stored data cannot be modified (except tags)
4. **Fee-based**: Small fees prevent spam and fund development

### Contract Relationships

```
                    ┌──────────────────┐
                    │  Contract Owner  │
                    │   (Deployer)     │
                    └────────┬─────────┘
                             │ Receives Fees
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │ hash-registry │ │stamp-registry │ │ tag-registry  │
    │   0.03 STX    │ │   0.05 STX    │ │   0.04 STX    │
    └───────────────┘ └───────────────┘ └───────────────┘
```

### Data Models

#### Hash Registry
The Hash Registry is designed for permanent, immutable storage of file fingerprints. Once a hash is stored, it cannot be modified or deleted, providing a "Proof of Existence" that is anchored to the Bitcoin blockchain.
- **Key Feature**: Irreversible records.
- **Use Case**: Legal documents, academic certificates, intellectual property.

#### Stamp Registry
The Stamp Registry allows users to record short text messages on-chain. Each message is automatically associated with a block height and a decentralized timestamp.
- **Key Feature**: Immutable narrative records.
- **Use Case**: Public announcements, official notices, on-chain journals.

#### Tag Registry
The Tag Registry provides a dynamic, updatable key-value store. Unlike the other registries, users can update the value associated with a specific key.
- **Key Feature**: Updatable state.
- **Use Case**: App configuration, profile metadata, version tracking.

### Data Models

#### Hash Registry
```clarity
{
  owner: principal,
  description: (string-utf8 128),
  timestamp: uint,
  block-height: uint,
  hash-id: uint
}
```

#### Stamp Registry
```clarity
{
  sender: principal,
  message: (string-utf8 256),
  timestamp: uint,
  block-height: uint
}
```

#### Tag Registry
```clarity
{
  owner: principal,
  key: (string-utf8 64),
  value: (string-utf8 256),
  timestamp: uint,
  block-height: uint
}
```

## Security Considerations

### On-Chain Security
- All transactions require valid signatures
- Fee mechanism prevents spam attacks
- Owner-only functions protected by principal checks

### Off-Chain Security
- Document hashes prove existence without exposing content
- SHA-256 hashing ensures collision resistance
- Timestamps are blockchain-derived (not client-provided)

## Scalability

### Current Limits
- User hashes/stamps/tags: 100 per user
- Message length: 256 characters
- Key length: 64 characters
- Value length: 256 characters

### Future Improvements
- Pagination for large datasets
- Batch operations for efficiency
- Layer 2 solutions for high-volume use cases

## Integration Points

### APIs
- Stacks API for transaction broadcasting
- Hiro API for blockchain queries
- Contract read functions for data retrieval

### Events
- Block confirmations indicate finality
- Transaction events trackable via API

## Deployment Architecture

### Testnet
- Used for development and testing
- Free testnet STX from faucet
- Same contract behavior as mainnet

### Mainnet
- Production deployment
- Real STX required for fees
- Permanent, immutable storage

## Monitoring & Maintenance

### Health Checks
- Contract function availability
- Fee collection tracking
- User activity monitoring
- Client retry behavior should include backoff for transient API failures.

### Upgrades
- New contracts can be deployed
- Migration paths for data (if needed)
- Backward compatibility considerations
