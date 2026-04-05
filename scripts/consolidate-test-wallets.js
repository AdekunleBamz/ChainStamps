import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import walletSdk from '@stacks/wallet-sdk';
import transactions from '@stacks/transactions';
import { networkFrom } from '@stacks/network';

const { generateWallet } = walletSdk;
const {
  makeSTXTokenTransfer,
  broadcastTransaction,
  privateKeyToAddress,
  validateStacksAddress,
} = transactions;

const MICROSTX_PER_STX = 1_000_000n;
const DEFAULT_CONFIG_PATH = 'settings/Devnet.toml';
const DEFAULT_DESTINATION = 'SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT';
const DEFAULT_FEE_BUFFER = 1_000n;

const CHAIN_SETTINGS = {
  devnet: {
    txNetwork: 'testnet',
    apiUrl: 'http://127.0.0.1:3999',
    coreUrl: 'http://127.0.0.1:20443',
  },
  testnet: {
    txNetwork: 'testnet',
    apiUrl: 'https://api.testnet.hiro.so',
    coreUrl: 'https://api.testnet.hiro.so',
  },
  mainnet: {
    txNetwork: 'mainnet',
    apiUrl: 'https://api.hiro.so',
    coreUrl: 'https://api.hiro.so',
  },
};

function printHelp() {
  console.log(`
Consolidate STX from repo test wallets into a single address.

Usage:
  node scripts/consolidate-test-wallets.js [options]

Options:
  --to <address>         Destination address. Default: ${DEFAULT_DESTINATION}
  --config <path>        Wallet config file. Default: ${DEFAULT_CONFIG_PATH}
  --chain <name>         One of: devnet, testnet, mainnet
                         Default: inferred from --to, then config, then devnet
  --api-url <url>        Override Stacks API base URL
  --core-url <url>       Override Stacks core node base URL
  --fee-buffer <ustx>    Extra microSTX held back beyond fee estimate. Default: ${DEFAULT_FEE_BUFFER}
  --memo <text>          Optional transfer memo (max 34 bytes)
  --allow-pending        Allow wallets with pending outbound STX to be swept
  --broadcast            Broadcast transactions. Without this flag the script is dry-run only.
  --help                 Show this message

Examples:
  node scripts/consolidate-test-wallets.js
  node scripts/consolidate-test-wallets.js --to ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
  node scripts/consolidate-test-wallets.js --chain devnet --broadcast
`.trim());
}

function parseArgs(argv) {
  const options = {
    to: DEFAULT_DESTINATION,
    configPath: DEFAULT_CONFIG_PATH,
    chain: null,
    apiUrl: null,
    coreUrl: null,
    feeBuffer: DEFAULT_FEE_BUFFER,
    memo: '',
    allowPending: false,
    broadcast: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--broadcast') {
      options.broadcast = true;
      continue;
    }

    if (arg === '--allow-pending') {
      options.allowPending = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    const [flag, inlineValue] = arg.split('=', 2);
    const readValue = () => {
      if (inlineValue != null) return inlineValue;
      const nextValue = argv[index + 1];
      if (nextValue == null) {
        throw new Error(`Missing value for ${flag}`);
      }
      index += 1;
      return nextValue;
    };

    if (flag === '--to') {
      options.to = readValue();
      continue;
    }

    if (flag === '--config') {
      options.configPath = readValue();
      continue;
    }

    if (flag === '--chain') {
      options.chain = readValue();
      continue;
    }

    if (flag === '--api-url') {
      options.apiUrl = readValue();
      continue;
    }

    if (flag === '--core-url') {
      options.coreUrl = readValue();
      continue;
    }

    if (flag === '--fee-buffer') {
      options.feeBuffer = BigInt(readValue());
      continue;
    }

    if (flag === '--memo') {
      options.memo = readValue();
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function parseTomlStringValue(line) {
  const match = line.match(/^[A-Za-z0-9_\-]+\s*=\s*"([^"]*)"$/);
  return match?.[1] ?? null;
}

function parseWalletConfig(tomlText) {
  const lines = tomlText.split(/\r?\n/);
  const accounts = [];
  let currentSection = null;
  let networkName = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      continue;
    }

    if (currentSection === 'network' && line.startsWith('name')) {
      networkName = parseTomlStringValue(line);
      continue;
    }

    if (!currentSection?.startsWith('accounts.')) {
      continue;
    }

    if (!line.startsWith('mnemonic')) {
      continue;
    }

    const mnemonic = parseTomlStringValue(line);
    if (!mnemonic || mnemonic.includes('<YOUR PRIVATE')) {
      continue;
    }

    accounts.push({
      name: currentSection.slice('accounts.'.length),
      mnemonic,
    });
  }

  return {
    networkName,
    accounts,
  };
}

function inferChain(options, configNetworkName) {
  if (options.chain) {
    return options.chain;
  }

  if (options.to) {
    const recipientNetwork = inferAddressNetwork(options.to);
    if (recipientNetwork === 'mainnet') {
      return 'mainnet';
    }

    if (configNetworkName === 'devnet') {
      return 'devnet';
    }

    return 'testnet';
  }

  if (configNetworkName && CHAIN_SETTINGS[configNetworkName]) {
    return configNetworkName;
  }

  return 'devnet';
}

function inferAddressNetwork(address) {
  const normalized = address.toUpperCase();

  if (normalized.startsWith('ST') || normalized.startsWith('SN')) {
    return 'testnet';
  }

  if (normalized.startsWith('SP') || normalized.startsWith('SM')) {
    return 'mainnet';
  }

  throw new Error(`Could not infer address network from ${address}`);
}

function parseBigIntValue(value) {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number') return BigInt(value);
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Cannot parse bigint from value: ${String(value)}`);
  }

  return value.startsWith('0x') ? BigInt(value) : BigInt(value);
}

function formatMicroStx(value) {
  const sign = value < 0n ? '-' : '';
  const absolute = value < 0n ? -value : value;
  const whole = absolute / MICROSTX_PER_STX;
  const fraction = (absolute % MICROSTX_PER_STX)
    .toString()
    .padStart(6, '0')
    .replace(/0+$/, '');

  return `${sign}${whole}${fraction ? `.${fraction}` : ''} STX`;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(`Request failed for ${url}: ${response.status} ${response.statusText} ${message}`);
  }
  return response.json();
}

async function fetchAddressState(address, endpoints) {
  let balancePayload = null;
  let noncePayload = null;

  try {
    balancePayload = await fetchJson(`${endpoints.apiUrl}/extended/v1/address/${address}/balances`);
  } catch (error) {
    balancePayload = null;
  }

  try {
    noncePayload = await fetchJson(`${endpoints.apiUrl}/extended/v1/address/${address}/nonces`);
  } catch (error) {
    noncePayload = null;
  }

  const corePayload = await fetchJson(`${endpoints.coreUrl}/v2/accounts/${address}?proof=0`);

  const coreBalance = parseBigIntValue(corePayload.balance);
  const coreLocked = parseBigIntValue(corePayload.locked ?? 0);
  const possibleNextNonce =
    noncePayload?.possible_next_nonce != null
      ? parseBigIntValue(noncePayload.possible_next_nonce)
      : parseBigIntValue(corePayload.nonce);

  const pendingOutbound =
    balancePayload?.stx?.pending_balance_outbound != null
      ? parseBigIntValue(balancePayload.stx.pending_balance_outbound)
      : 0n;

  const pendingInbound =
    balancePayload?.stx?.pending_balance_inbound != null
      ? parseBigIntValue(balancePayload.stx.pending_balance_inbound)
      : 0n;

  const onChainBalance =
    balancePayload?.stx?.balance != null ? parseBigIntValue(balancePayload.stx.balance) : coreBalance;
  const lockedBalance =
    balancePayload?.stx?.locked != null ? parseBigIntValue(balancePayload.stx.locked) : coreLocked;

  return {
    balance: onChainBalance,
    locked: lockedBalance,
    pendingOutbound,
    pendingInbound,
    nonce: possibleNextNonce,
  };
}

async function deriveWallet(name, mnemonic, txNetwork) {
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: '',
  });
  const account = wallet.accounts[0];
  const senderKey = account.stxPrivateKey;

  return {
    name,
    address: privateKeyToAddress(senderKey, networkFrom(txNetwork)),
    senderKey,
  };
}

async function estimateTransferFee({ recipient, senderKey, nonce, txNetwork, coreUrl, memo }) {
  const tx = await makeSTXTokenTransfer({
    recipient,
    amount: 1n,
    senderKey,
    network: txNetwork,
    client: { baseUrl: coreUrl },
    nonce,
    memo,
  });

  return parseBigIntValue(tx.auth.spendingCondition.fee);
}

async function buildTransfer({ recipient, amount, senderKey, nonce, fee, txNetwork, coreUrl, memo }) {
  return makeSTXTokenTransfer({
    recipient,
    amount,
    senderKey,
    network: txNetwork,
    client: { baseUrl: coreUrl },
    nonce,
    fee,
    memo,
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (!validateStacksAddress(options.to)) {
    throw new Error(`Destination address is not a valid Stacks address: ${options.to}`);
  }

  if (Buffer.byteLength(options.memo, 'utf8') > 34) {
    throw new Error('Memo must be 34 bytes or less');
  }

  const configText = await readFile(options.configPath, 'utf8');
  const parsedConfig = parseWalletConfig(configText);
  const chain = inferChain(options, parsedConfig.networkName);
  const chainSettings = CHAIN_SETTINGS[chain];

  if (!chainSettings) {
    throw new Error(`Unsupported chain "${chain}". Use one of: ${Object.keys(CHAIN_SETTINGS).join(', ')}`);
  }

  const endpoints = {
    apiUrl: options.apiUrl ?? chainSettings.apiUrl,
    coreUrl: options.coreUrl ?? chainSettings.coreUrl,
  };

  const expectedRecipientNetwork = chainSettings.txNetwork;
  const actualRecipientNetwork = inferAddressNetwork(options.to);

  if (expectedRecipientNetwork !== actualRecipientNetwork) {
    throw new Error(
      [
        `Destination ${options.to} is a ${actualRecipientNetwork} address, but the selected chain expects ${expectedRecipientNetwork} addresses.`,
        `Use an ${expectedRecipientNetwork === 'testnet' ? 'ST...' : 'SP...'} recipient for this run,`,
        `or switch --chain if you meant to sweep a different network.`,
      ].join(' ')
    );
  }

  const wallets = parsedConfig.accounts.filter(account => /^wallet_\d+$/.test(account.name));
  if (wallets.length === 0) {
    throw new Error(`No wallet_n accounts found in ${basename(options.configPath)}`);
  }

  console.log(`Mode: ${options.broadcast ? 'broadcast' : 'dry-run'}`);
  console.log(`Chain: ${chain} (tx network: ${chainSettings.txNetwork})`);
  console.log(`Config: ${options.configPath}`);
  console.log(`API URL: ${endpoints.apiUrl}`);
  console.log(`Core URL: ${endpoints.coreUrl}`);
  console.log(`Destination: ${options.to}`);
  console.log('');

  let totalSpendable = 0n;
  let totalFees = 0n;
  let preparedCount = 0;

  for (const walletEntry of wallets) {
    const wallet = await deriveWallet(walletEntry.name, walletEntry.mnemonic, chainSettings.txNetwork);
    const state = await fetchAddressState(wallet.address, endpoints);

    if (wallet.address === options.to) {
      console.log(`[skip] ${wallet.name} ${wallet.address} already matches the destination`);
      continue;
    }

    if (state.pendingOutbound > 0n && !options.allowPending) {
      console.log(
        `[skip] ${wallet.name} ${wallet.address} has pending outbound STX (${formatMicroStx(state.pendingOutbound)}).`
      );
      continue;
    }

    const availableBalance = state.balance - state.locked - state.pendingOutbound;
    const feeEstimate = await estimateTransferFee({
      recipient: options.to,
      senderKey: wallet.senderKey,
      nonce: state.nonce,
      txNetwork: chainSettings.txNetwork,
      coreUrl: endpoints.coreUrl,
      memo: options.memo,
    });

    const fee = feeEstimate + options.feeBuffer;
    const spendable = availableBalance - fee;

    if (spendable <= 0n) {
      console.log(
        `[skip] ${wallet.name} ${wallet.address} has no spendable STX after fees (available ${formatMicroStx(availableBalance)}, fee ${formatMicroStx(fee)}).`
      );
      continue;
    }

    preparedCount += 1;
    totalSpendable += spendable;
    totalFees += fee;

    console.log(
      [
        `[ready] ${wallet.name}`,
        wallet.address,
        `balance=${formatMicroStx(state.balance)}`,
        `locked=${formatMicroStx(state.locked)}`,
        `pendingOut=${formatMicroStx(state.pendingOutbound)}`,
        `nonce=${state.nonce}`,
        `fee=${formatMicroStx(fee)}`,
        `send=${formatMicroStx(spendable)}`,
      ].join(' | ')
    );

    if (!options.broadcast) {
      continue;
    }

    const signedTx = await buildTransfer({
      recipient: options.to,
      amount: spendable,
      senderKey: wallet.senderKey,
      nonce: state.nonce,
      fee,
      txNetwork: chainSettings.txNetwork,
      coreUrl: endpoints.coreUrl,
      memo: options.memo,
    });

    const result = await broadcastTransaction({
      transaction: signedTx,
      network: chainSettings.txNetwork,
      client: { baseUrl: endpoints.coreUrl },
    });

    if ('txid' in result) {
      console.log(`[sent]  ${wallet.name} txid=${result.txid}`);
      continue;
    }

    console.log(`[fail]  ${wallet.name} ${JSON.stringify(result)}`);
  }

  console.log('');
  console.log(`Prepared wallets: ${preparedCount}`);
  console.log(`Total STX to send: ${formatMicroStx(totalSpendable)}`);
  console.log(`Total fees held back: ${formatMicroStx(totalFees)}`);

  if (!options.broadcast) {
    console.log('');
    console.log('Dry-run only. Re-run with --broadcast to submit the transfers.');
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
