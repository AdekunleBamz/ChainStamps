# TypeScript SDK Usage Examples

This document shows how to interact with ChainStamps contracts using the Stacks.js SDK.

## Installation

```bash
npm install @stacks/transactions @stacks/network @stacks/connect
```

## Setup

```typescript
import { 
  makeContractCall, 
  broadcastTransaction,
  bufferCV,
  stringUtf8CV,
  uintCV,
  principalCV
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

// Configure network
const network = new StacksTestnet(); // or StacksMainnet()

// Contract details (update after deployment)
const CONTRACT_ADDRESS = 'YOUR_DEPLOYER_ADDRESS';
```

## Wallet Connect (Browser)

```typescript
import { showConnect, openContractCall } from '@stacks/connect';
import { uintCV, stringUtf8CV } from '@stacks/transactions';

const appDetails = {
  name: 'ChainStamps',
  icon: window.location.origin + '/logo.png'
};

function connectWallet() {
  showConnect({
    appDetails,
    onFinish: data => {
      console.log('Connected:', data);
    }
  });
}

async function stampWithWallet(message: string) {
  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'stamp-registry',
    functionName: 'stamp-message',
    functionArgs: [stringUtf8CV(message)],
    network,
    onFinish: data => {
      console.log('Tx sent:', data);
    }
  });
}
```

## Hash Registry Examples

### Store a Document Hash

```typescript
import { sha256 } from '@noble/hashes/sha256';

async function storeDocumentHash(
  document: Uint8Array, 
  description: string,
  senderKey: string
) {
  // Hash the document
  const hash = sha256(document);
  
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'hash-registry',
    functionName: 'store-hash',
    functionArgs: [
      bufferCV(hash),
      stringUtf8CV(description)
    ],
    senderKey,
    network,
    fee: 1000n,
    postConditionMode: 1
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  return broadcastResponse;
}
```

### Verify a Document Hash

```typescript
async function verifyHash(hash: Uint8Array) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'hash-registry',
    functionName: 'verify-hash',
    functionArgs: [bufferCV(hash)],
    network,
    senderAddress: CONTRACT_ADDRESS
  });
  
  return result.type === 'true';
}
```

## Stamp Registry Examples

### Create a Message Stamp

```typescript
async function stampMessage(
  message: string,
  senderKey: string
) {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'stamp-registry',
    functionName: 'stamp-message',
    functionArgs: [stringUtf8CV(message)],
    senderKey,
    network,
    fee: 1000n,
    postConditionMode: 1
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}
```

### Retrieve a Stamp

```typescript
async function getStamp(stampId: number) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'stamp-registry',
    functionName: 'get-stamp',
    functionArgs: [uintCV(stampId)],
    network,
    senderAddress: CONTRACT_ADDRESS
  });
  
  return cvToJSON(result);
}
```

## Tag Registry Examples

### Store a Key-Value Tag

```typescript
async function storeTag(
  key: string,
  value: string,
  senderKey: string
) {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'tag-registry',
    functionName: 'store-tag',
    functionArgs: [
      stringUtf8CV(key),
      stringUtf8CV(value)
    ],
    senderKey,
    network,
    fee: 1000n,
    postConditionMode: 1
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}
```

### Get Tag by Key

```typescript
async function getTagByKey(owner: string, key: string) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'tag-registry',
    functionName: 'get-tag-by-key',
    functionArgs: [
      principalCV(owner),
      stringUtf8CV(key)
    ],
    network,
    senderAddress: CONTRACT_ADDRESS
  });
  
  return cvToJSON(result);
}
```

## Complete Example

```typescript
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';

async function main() {
  // Generate or load wallet
  const wallet = await generateWallet({
    secretKey: 'your-mnemonic-phrase',
    password: 'password'
  });
  
  const account = wallet.accounts[0];
  const address = getStxAddress({ account, network });
  
  console.log('Address:', address);
  
  // Store a hash
  const document = new TextEncoder().encode('Hello ChainStamps!');
  await storeDocumentHash(document, 'My first document', account.stxPrivateKey);
  
  // Create a stamp
  await stampMessage('Recorded on the blockchain!', account.stxPrivateKey);
  
  // Store a tag
  await storeTag('profile', 'chainstamps_user', account.stxPrivateKey);
}

main().catch(console.error);
```

## Notes

- All transactions require STX for fees plus the contract fee
- Hash Registry: 0.03 STX
- Stamp Registry: 0.05 STX  
- Tag Registry: 0.04 STX

For more information, see the [Stacks.js documentation](https://github.com/hirosystems/stacks.js).
