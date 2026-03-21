import walletSdk from '@stacks/wallet-sdk';
import fs from 'fs';

const { generateSecretKey, generateWallet, getStxAddress } = walletSdk;

// Define TransactionVersion manually to avoid import issues from sub-dependencies
const TransactionVersion = {
    Mainnet: 0,
    Testnet: 128
};

async function main() {
    console.log("Generating 25 wallets...");
    const wallets = [];

    for (let i = 0; i < 25; i++) {
        const secretKey = generateSecretKey();
        const wallet = await generateWallet({
            secretKey,
            password: '',
        });
        const account = wallet.accounts[0];
        const address = getStxAddress({
            account,
            transactionVersion: TransactionVersion.Mainnet,
        });

        wallets.push({
            id: i + 1,
            address,
            mnemonic: secretKey
        });

        if (i === 0) {
            console.log("\n==========================================");
            console.log(`WALLET 1 (FUND THIS ONE): ${address}`);
            console.log("==========================================\n");
        }
    }

    fs.writeFileSync('test-wallets.json', JSON.stringify(wallets, null, 2));
    console.log("Saved 25 wallets to test-wallets.json");
}

main().catch(console.error);
