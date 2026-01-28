# Mainnet Deployment Guide

⚠️ **WARNING**: Mainnet deployment uses real STX tokens. Double-check everything before proceeding.

## Prerequisites

1. **Successful testnet deployment** - Deploy and test on testnet first
2. **Clarinet** v2.0+ installed
3. **Stacks Wallet** with mainnet STX for deployment fees
4. **All tests passing** - `npm test` should pass 100%

## Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] Contracts deployed and tested on testnet
- [ ] Code reviewed and audited
- [ ] Fee amounts are correct
- [ ] Error codes are documented
- [ ] README is updated
- [ ] No hardcoded testnet values

## Deployment Fees

Estimated deployment costs:
- Contract deployment: ~0.5-2 STX per contract
- Total for all 3 contracts: ~2-6 STX

## Configuration

### 1. Verify Clarinet.toml

```toml
[project]
name = 'chainstamp'
requirements = []

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

### 2. Review Deployment Plan

Check `deployments/default.mainnet-plan.yaml`:

```yaml
---
id: 0
name: Mainnet Deployment
network: mainnet
stacks-node: "https://api.mainnet.hiro.so"
bitcoin-node: "https://api.mainnet.hiro.so"
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: hash-registry
            expected-sender: $DEPLOYER
            path: contracts/hash-registry.clar
        - contract-publish:
            contract-name: stamp-registry
            expected-sender: $DEPLOYER
            path: contracts/stamp-registry.clar
        - contract-publish:
            contract-name: tag-registry
            expected-sender: $DEPLOYER
            path: contracts/tag-registry.clar
```

## Deployment Steps

### Step 1: Final Verification

```bash
# Check syntax
clarinet check

# Run all tests
npm test

# Review contracts one more time
cat contracts/*.clar
```

### Step 2: Deploy to Mainnet

```bash
clarinet deployments apply --mainnet
```

You will be prompted to:
1. Connect your wallet or enter mnemonic
2. Review transaction details
3. Confirm deployment
4. Pay deployment fees

### Step 3: Wait for Confirmation

Mainnet transactions can take 10-30 minutes to confirm. Monitor at:
- https://explorer.hiro.so/?chain=mainnet

### Step 4: Verify Deployment

Search for your contract addresses in the explorer:
- `SP<your-address>.hash-registry`
- `SP<your-address>.stamp-registry`
- `SP<your-address>.tag-registry`

## Post-Deployment

### 1. Update Documentation

Update README with mainnet contract addresses:

```markdown
## Mainnet Contracts
- Hash Registry: `SP....hash-registry`
- Stamp Registry: `SP....stamp-registry`
- Tag Registry: `SP....tag-registry`
```

### 2. Test Live Contracts

Call read-only functions to verify:

```javascript
import { callReadOnlyFunction } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const result = await callReadOnlyFunction({
  contractAddress: 'SP...',
  contractName: 'hash-registry',
  functionName: 'get-hash-fee',
  functionArgs: [],
  network: new StacksMainnet(),
});
```

### 3. Monitor

- Watch for transactions to your contracts
- Monitor fee collection
- Track usage metrics

## Troubleshooting

### Transaction Stuck
Wait up to 30 minutes. Check mempool status in explorer.

### Deployment Failed
- Check you have enough STX
- Verify contract syntax
- Try again with higher fee

### Contract Not Found
Ensure transaction is confirmed, then search again.

## Security Reminders

1. **Never share your mnemonic**
2. **Keep deployment wallet secure**
3. **Monitor contracts for unexpected activity**
4. **Have an incident response plan**

## Support

For deployment issues:
1. Check [Stacks Discord](https://stacks.chat)
2. Review [Clarinet documentation](https://docs.hiro.so/clarinet)
3. Open an issue in this repository
