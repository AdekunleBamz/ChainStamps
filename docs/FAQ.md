# Frequently Asked Questions (FAQ)

## General Questions

### What is ChainStamps?
ChainStamps is a decentralized timestamping and data storage platform built on the Stacks blockchain. It allows you to permanently store document hashes, messages, and key-value pairs on-chain.

### Why use ChainStamps instead of a database?
ChainStamps provides:
- **Immutability**: Data cannot be altered or deleted
- **Transparency**: Anyone can verify stored data
- **Decentralization**: No single point of failure
- **Bitcoin Security**: Inherited through Stacks' PoX consensus

### What blockchain does ChainStamps use?
ChainStamps is built on Stacks, a Bitcoin Layer 2 blockchain. This means your data benefits from Bitcoin's security while enjoying smart contract functionality.

## Technical Questions

### What are the fees?
| Contract | Fee |
|----------|-----|
| Hash Registry | 0.03 STX |
| Stamp Registry | 0.05 STX |
| Tag Registry | 0.04 STX |

Plus standard Stacks network transaction fees.

### What is the maximum message length?
- **Stamp messages**: 256 characters (UTF-8)
- **Tag keys**: 64 characters (UTF-8)
- **Tag values**: 256 characters (UTF-8)
- **Hash descriptions**: 128 characters (UTF-8)

### Can I store files on ChainStamps?
No, ChainStamps stores hashes and small messages, not files. For document verification:
1. Hash your document locally using SHA-256
2. Store the hash on-chain via Hash Registry
3. Keep your original file secure

### How do I verify a document?
1. Hash your document using SHA-256
2. Call `verify-hash` with the hash
3. If it returns `true`, the document was registered

### Is my data private?
No. All data stored on-chain is publicly visible. For sensitive documents:
- Only store the hash, not the content
- The hash proves existence without revealing content

## Usage Questions

### How do I get STX tokens?
- **Testnet**: Use the [Stacks Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
- **Mainnet**: Purchase from exchanges like OKX, Binance, or Coinbase

### What wallet should I use?
Recommended wallets:
- [Leather Wallet](https://leather.io/) (Browser extension)
- [Xverse](https://www.xverse.app/) (Mobile and desktop)

### Can I update stored data?
- **Hash Registry**: No, hashes are immutable
- **Stamp Registry**: No, stamps are immutable
- **Tag Registry**: Yes, tag values can be updated by the owner

### Can I delete my data?
Blockchain data is permanent. Plan carefully before storing.

## Development Questions

### How do I run tests locally?
```bash
npm install
npm test
```

### How do I deploy to testnet?
See [Testnet Deployment Guide](./docs/DEPLOYMENT_TESTNET.md)

### What programming language are the contracts written in?
Clarity, Stacks' smart contract language. It's decidable, meaning you can know exactly what a contract will do before execution.

### Can I contribute to ChainStamps?
Yes! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Troubleshooting

### Transaction failed with insufficient funds
Ensure you have enough STX for:
1. The contract fee (0.03-0.05 STX)
2. Network transaction fee (~0.001 STX)

### Hash already exists error
Each hash can only be registered once. If you get this error, the document has already been timestamped.

### Transaction pending for a long time
Stacks blocks are anchored to Bitcoin (~10 min). Transactions may take longer during high network activity.

## Contact & Support

- GitHub Issues: Report bugs and feature requests
- Documentation: Check the docs folder for detailed guides
