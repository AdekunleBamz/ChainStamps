import walletSdk from '@stacks/wallet-sdk';
import transactions from '@stacks/transactions';
import network from '@stacks/network';
import fs from 'fs';

const { generateWallet } = walletSdk;
const {
    makeSTXTokenTransfer,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode
} = transactions;
const { createNetwork, STACKS_MAINNET } = network;

const TEST_WALLETS_FILE = 'test-wallets.json';
const STX_TO_DISTRIBUTE = 0.123 * 1000000; // 0.123 STX
const FEE = 1000; // 0.001 STX
const WAIT_TIME_MS = 3000; // 3 seconds
const CONFIRMATION_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

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

    const wallets = JSON.parse(fs.readFileSync(TEST_WALLETS_FILE));
    const w1 = wallets[0];
    const others = wallets.slice(1);

    console.log(`\n--- Checking Balance for W1: ${w1.address} ---`);
    const balance = await getAddressBalance(w1.address);
    console.log(`Current Balance: ${balance / 1000000} STX`);

    const totalNeeded = (STX_TO_DISTRIBUTE + FEE) * others.length;
    console.log(`Total Needed for Distribution: ${totalNeeded / 1000000} STX`);

    if (balance < totalNeeded) {
        console.error("Error: Insufficient balance in Wallet 1 to perform distribution.");
        console.log(`Please fund ${w1.address} with at least ${totalNeeded / 1000000} STX.`);
        return;
    }

    console.log("\nBalance check passed. Starting distribution...");
    const w1Wallet = await generateWallet({
        secretKey: w1.mnemonic,
        password: '',
    });
    const w1Account = w1Wallet.accounts[0];
    const mainnet = createNetwork(STACKS_MAINNET);

    for (const wallet of others) {
        // GUARANTEED 3 SEC DELAY between broadcasts
        console.log(`\nWaiting ${WAIT_TIME_MS / 1000} seconds before next broadcast...`);
        await new Promise(r => setTimeout(r, WAIT_TIME_MS));

        console.log(`Sending STX to Wallet ${wallet.id}: ${wallet.address}...`);

        try {
            const txOptions = {
                recipient: wallet.address,
                amount: BigInt(STX_TO_DISTRIBUTE),
                senderKey: w1Account.stxPrivateKey,
                network: mainnet,
                fee: BigInt(FEE),
                anchorMode: AnchorMode.Any,
                postConditionMode: PostConditionMode.Allow,
            };

            const transaction = await makeSTXTokenTransfer(txOptions);
            const broadcastResponse = await broadcastTransaction({ transaction });

            if (broadcastResponse.error) {
                console.error(`Broadcast failed: ${broadcastResponse.error}`);
                continue;
            }

            const txid = broadcastResponse.txid;
            console.log(`Transaction broadcasted! TXID: ${txid}`);

            // Wait for confirmation
            const startTime = Date.now();
            let confirmed = false;

            while (Date.now() - startTime < CONFIRMATION_TIMEOUT_MS) {
                const status = await getTransactionStatus(txid);
                if (status === 'success') {
                    console.log("\x1b[32m%s\x1b[0m", `CHECKED GREEN: Wallet ${wallet.id} confirmed!`);
                    confirmed = true;
                    break;
                } else if (status === 'abort_by_mempool' || status === 'abort_by_response') {
                    console.error(`Transaction aborted: ${status}`);
                    break;
                }

                process.stdout.write(".");
                await new Promise(r => setTimeout(r, 20000)); // Poll every 20s
            }

            if (!confirmed) {
                console.warn("\n\x1b[33m%s\x1b[0m", `3m Check: Wallet ${wallet.id} not confirmed on-chain yet. Proceeding...`);
            }

        } catch (e) {
            console.error(`\nError during distribution to Wallet ${wallet.id}:`, e.message);
        }
    }

    console.log("\nDistribution process finished.");
}

main().catch(console.error);
