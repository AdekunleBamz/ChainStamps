import walletSdk from '@stacks/wallet-sdk';
import transactions from '@stacks/transactions';

const { generateWallet, getStxAddress } = walletSdk;
const { TransactionVersion } = transactions;

async function main() {
    const mnemonic = "tourist chief old shadow clap injury join spoil birth copper valid skate";
    try {
        const wallet = await generateWallet({
            mnemonic,
            password: '',
        });
        const account = wallet.accounts[0];
        const address = getStxAddress({
            account,
            transactionVersion: TransactionVersion.Mainnet,
        });
        console.log(address);
    } catch (e) {
        console.error(e);
    }
}

main();
