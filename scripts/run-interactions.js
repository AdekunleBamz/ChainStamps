import walletSdk from '@stacks/wallet-sdk';
import transactions from '@stacks/transactions';
import network from '@stacks/network';
import fs from 'fs';
import crypto from 'crypto';

const { generateWallet } = walletSdk;
const {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    bufferCV,
    stringUtf8CV
} = transactions;
const { createNetwork, STACKS_MAINNET } = network;

const TEST_WALLETS_FILE = 'test-wallets.json';
const FEE = 1000; // 0.001 STX
const WAIT_TIME_MS = 3000; // 3 seconds
const CONFIRMATION_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes (Mainnet needs more than 3m usually)

const CONTRACT_ADDRESS = 'SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT';
const CONTRACTS = [
    { name: 'hash-registry', functionName: 'store-hash', args: () => [bufferCV(crypto.randomBytes(32)), stringUtf8CV("Test Hash")] },
    { name: 'stamp-registry', functionName: 'stamp-message', args: () => [stringUtf8CV(`Test Stamp ${Date.now()}`)] },
    { name: 'tag-registry', functionName: 'store-tag', args: () => [stringUtf8CV(`key-${crypto.randomBytes(4).toString('hex')}`), stringUtf8CV("Test Value")] }
];

async function getAddressBalance(address) {
    try {
        const response = await fetch(`https://api.hiro.so/extended/v1/address/${address}/balances`);
        if (!response.ok) return 0;
        const data = await response.json();
        return parseInt(data.stx.balance);
    } catch (e) {
        return 0;
    }
}

async function getTransactionStatus(txid) {
    try {
        const response = await fetch(`https://api.hiro.so/extended/v1/tx/${txid}`);
        if (!response.ok) return 'unknown';
        const data = await response.json();
        return data.tx_status;
    } catch (e) {
        return 'unknown';
    }
}

async function main() {
    if (!fs.existsSync(TEST_WALLETS_FILE)) {
        console.error("Test wallets file not found. Run generate-wallets.js first.");
        return;
    }

    const walletsRaw = JSON.parse(fs.readFileSync(TEST_WALLETS_FILE));
    const wallets = [];
    const mainnet = createNetwork(STACKS_MAINNET);

    console.log("Preparing wallets and checking balances...");
    for (const w of walletsRaw) {
        const balance = await getAddressBalance(w.address);
        const wallet = await generateWallet({
            secretKey: w.mnemonic,
            password: '',
        });
        wallets.push({
            id: w.id,
            address: w.address,
            balance,
            privateKey: wallet.accounts[0].stxPrivateKey,
            remainingInteractions: {
                'hash-registry': 1,
                'stamp-registry': 1,
                'tag-registry': 1
            }
        });
        console.log(`Wallet ${w.id}: ${w.address} | Balance: ${balance / 1000000} STX`);
    }

    let totalRemaining = wallets.length * 3;
    console.log(`\nStarting SEQUENTIAL test suite. Total interactions: ${totalRemaining}`);
    console.log("Note: Each transaction will wait for confirmation before the next one starts.");

    // Flatten all pending tasks into a queue for easier randomization/sequence
    const taskQueue = [];
    for (const wallet of wallets) {
        for (const contractName of Object.keys(wallet.remainingInteractions)) {
            taskQueue.push({ wallet, contractName });
        }
    }

    // Shuffle the queue
    for (let i = taskQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [taskQueue[i], taskQueue[j]] = [taskQueue[j], taskQueue[i]];
    }

    for (let i = 0; i < taskQueue.length; i++) {
        const { wallet, contractName } = taskQueue[i];
        const contractInfo = CONTRACTS.find(c => c.name === contractName);

        console.log(`\n[${i + 1}/${taskQueue.length}] Waiting ${WAIT_TIME_MS / 1000}s delay...`);
        await new Promise(r => setTimeout(r, WAIT_TIME_MS));

        console.log(`Wallet ${wallet.id} calling ${contractName}.${contractInfo.functionName}...`);

        try {
            const txOptions = {
                contractAddress: CONTRACT_ADDRESS,
                contractName: contractName,
                functionName: contractInfo.functionName,
                functionArgs: contractInfo.args(),
                senderKey: wallet.privateKey,
                network: mainnet,
                fee: BigInt(FEE),
                anchorMode: AnchorMode.Any,
                postConditionMode: PostConditionMode.Allow,
            };

            const transaction = await makeContractCall(txOptions);
            const broadcastResponse = await broadcastTransaction({ transaction });

            if (broadcastResponse.error) {
                console.error(`Broadcast failed for Wallet ${wallet.id}: ${broadcastResponse.error}`);
                continue;
            }

            const txid = broadcastResponse.txid;
            console.log(`Transaction broadcasted! TXID: ${txid}`);
            console.log("Waiting for confirmation on-chain...");

            // STRICT SEQUENTIAL WAIT
            const startTime = Date.now();
            let confirmed = false;

            while (Date.now() - startTime < CONFIRMATION_TIMEOUT_MS) {
                const status = await getTransactionStatus(txid);
                if (status === 'success') {
                    console.log("\x1b[32m%s\x1b[0m", `[√] CHECKED GREEN: Wallet ${wallet.id} interaction confirmed! (${contractName})`);
                    confirmed = true;
                    break;
                } else if (status === 'abort_by_mempool' || status === 'abort_by_response') {
                    console.error(`[X] Transaction aborted for Wallet ${wallet.id}: ${status}`);
                    break;
                }

                process.stdout.write(".");
                await new Promise(r => setTimeout(r, 30000)); // Poll every 30s
            }

            if (!confirmed) {
                console.warn("\n\x1b[33m%s\x1b[0m", `[!] Timeout reached (20m). The transaction is likely still in mempool. Proceeding...`);
            }

            // Refresh balance after confirmation
            wallet.balance = await getAddressBalance(wallet.address);

        } catch (e) {
            console.error(`Error during interaction for Wallet ${wallet.id}:`, e.message);
        }
    }

    console.log("\nAll planned interactions processed.");
}

main().catch(console.error);
