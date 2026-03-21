import fs from 'fs';

const TEST_WALLETS_FILE = 'test-wallets.json';

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
    console.log("Checking current balances for all 25 wallets...\n");

    let totalStx = 0;
    for (const w of wallets) {
        const balance = await getAddressBalance(w.address);
        totalStx += balance;
        console.log(`Wallet ${w.id}: ${w.address} | Balance: ${balance / 1000000} STX`);
    }

    console.log("\n==========================================");
    console.log(`TOTAL REMAINING ACROSS ALL WALLETS: ${totalStx / 1000000} STX`);
    console.log("==========================================\n");
}

main().catch(console.error);
