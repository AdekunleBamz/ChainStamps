# Testnet Deployment Guide

This guide walks you through deploying ChainStamps contracts to Stacks Testnet.

## Prerequisites

1. **Clarinet** installed (v2.0+)
2. **Stacks Wallet** with testnet STX
3. **Node.js** v18+

## Getting Testnet STX

1. Visit the [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
2. Connect your wallet
3. Request testnet STX (you'll receive ~500 STX)

## Configuration

### 1. Update Clarinet.toml

Ensure your `Clarinet.toml` has the correct configuration:

```toml
[project]
name = 'chainstamp'

[contracts.hash-registry]
path = 'contracts/hash-registry.clar'
clarity_version = 4
epoch = 'latest'

[contracts.stamp-registry]
path = 'contracts/stamp-registry.clar'
clarity_version = 4
epoch = 'latest'

[contracts.tag-registry]
path = 'contracts/tag-registry.clar'
clarity_version = 4
epoch = 'latest'
```

### 2. Set Up Deployment Plan

The deployment plan is located in `deployments/default.testnet-plan.yaml`.

## Deployment Steps

### Step 1: Verify Contracts

```bash
clarinet check
```

Ensure all contracts pass syntax validation.

### Step 2: Run Tests

```bash
npm test
```

Make sure all tests pass before deployment.

### Step 3: Deploy to Testnet

```bash
clarinet deployments apply --testnet
```

You'll be prompted to:
1. Enter your wallet mnemonic or connect wallet
2. Confirm the deployment transaction
3. Pay the deployment fee in testnet STX

### Step 4: Verify Deployment

After deployment, check the Stacks Explorer:
- https://explorer.hiro.so/?chain=testnet

Search for your contract address to verify deployment.

## Contract Addresses

After deployment, your contracts will be available at:
- `ST<your-address>.hash-registry`
- `ST<your-address>.stamp-registry`
- `ST<your-address>.tag-registry`

## Testing Deployed Contracts

### Using Clarinet Console

```bash
clarinet console --testnet
```

Then interact with your contracts:

```clarity
(contract-call? .hash-registry get-hash-fee)
```

### Using Stacks.js

```javascript
import { callReadOnlyFunction } from '@stacks/transactions';

const result = await callReadOnlyFunction({
  contractAddress: 'ST...',
  contractName: 'hash-registry',
  functionName: 'get-hash-fee',
  functionArgs: [],
  network: 'testnet',
});
```

## Troubleshooting

### Insufficient Funds
Ensure you have enough testnet STX. Request more from the faucet.

### Transaction Pending
Testnet can be slow. Wait 10-15 minutes for confirmation.

### Contract Already Exists
Each address can only deploy a contract with the same name once. Use a different wallet or contract name.

## Next Steps

After successful testnet deployment:
1. Test all contract functions
2. Verify fee collection works
3. Test error conditions
4. Plan mainnet deployment

See [DEPLOYMENT_MAINNET.md](./DEPLOYMENT_MAINNET.md) for mainnet instructions.
