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
const DEPLOYER_ADDRESS = 'SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT';
const FEE = 1000; // 0.001 STX
const WAIT_TIME_MS = 3000; // 3 seconds

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

async function main() {
    if (!fs.existsSync(TEST_WALLETS_FILE)) {
        console.error("Test wallets file not found.");
        return;
    }

    const wallets = JSON.parse(fs.readFileSync(TEST_WALLETS_FILE));
    const mainnet = createNetwork(STACKS_MAINNET);

    console.log(`Starting consolidation to deployer: ${DEPLOYER_ADDRESS}\n`);

    for (const w of wallets) {
        const balance = await getAddressBalance(w.address);

        if (balance <= FEE) {
            continue;
        }

        const amountToSweep = balance - FEE;
        console.log(`Sweeping ${amountToSweep / 1000000} STX from Wallet ${w.id} (${w.address})...`);

        const wallet = await generateWallet({
            secretKey: w.mnemonic,
            password: '',
        });
        const account = wallet.accounts[0];

        try {
            const txOptions = {
                recipient: DEPLOYER_ADDRESS,
                amount: BigInt(amountToSweep),
                senderKey: account.stxPrivateKey,
                network: mainnet,
                fee: BigInt(FEE),
                anchorMode: AnchorMode.Any,
                postConditionMode: PostConditionMode.Allow,
            };

            const transaction = await makeSTXTokenTransfer(txOptions);
            const broadcastResponse = await broadcastTransaction({ transaction });

            if (broadcastResponse.error) {
                console.error(`Broadcast failed: ${broadcastResponse.error}`);
            } else {
                console.log(`Successfully broadcasted sweep. TXID: ${broadcastResponse.txid}`);
            }

            // Guaranteed delay between broadcasts
            await new Promise(r => setTimeout(r, WAIT_TIME_MS));

        } catch (e) {
            console.error(`Error sweeping Wallet ${w.id}:`, e.message);
        }
    }

    console.log("\nConsolidation process finished.");
}

main().catch(console.error);
