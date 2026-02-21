import UniversalProvider from '@walletconnect/universal-provider';

const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

if (!PROJECT_ID || PROJECT_ID === 'YOUR_PROJECT_ID_HERE') {
  console.warn('⚠️ WalletConnect Project ID not set. Get one from https://cloud.walletconnect.com');
}

// Metadata for WalletConnect - icons array must be non-empty
const metadata = {
  name: 'ChainStamp',
  description: 'Immutable timestamping on Bitcoin via Stacks',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://chainstamp.app',
  icons: [typeof window !== 'undefined' ? new URL('/logo.svg', window.location.origin).toString() : 'https://chainstamp.app/logo.svg'],
};

// Stacks mainnet chain ID in CAIP format
export const STACKS_MAINNET = 'stacks:1';

// Required namespaces for Stacks
const requiredNamespaces = {
  stacks: {
    chains: [STACKS_MAINNET],
    methods: ['stx_getAddresses', 'stx_signTransaction', 'stx_callContract', 'stx_transferStx'],
    events: [],
  },
};

let provider: UniversalProvider | null = null;
let wcUri: string | null = null;

export interface WCSession {
  topic: string;
  namespaces: Record<string, { accounts: string[]; methods: string[]; events: string[] }>;
}

export interface StxAddress {
  address: string;
  publicKey?: string;
  symbol?: string;
}

// Initialize the Universal Provider
export async function initProvider(): Promise<UniversalProvider> {
  if (provider) return provider;

  if (DEBUG) console.log('🔧 Initializing WalletConnect provider...');

  provider = await UniversalProvider.init({
    projectId: PROJECT_ID,
    metadata,
    relayUrl: 'wss://relay.walletconnect.com',
  });

  // Listen for session disconnect
  provider.on('session_delete', () => {
    if (DEBUG) console.log('🔌 Session deleted');
    wcUri = null;
  });

  if (DEBUG) console.log('✅ Provider initialized');
  return provider;
}

// Get the current provider instance
export function getProvider(): UniversalProvider | null {
  return provider;
}

// Connect to wallet and return session
export async function wcConnect(
  onDisplayUri?: (uri: string) => void
): Promise<{ session: WCSession; address: string; publicKey?: string }> {
  const prov = await initProvider();

  // Subscribe to display_uri BEFORE calling connect
  if (onDisplayUri) {
    prov.on('display_uri', (uri: string) => {
      if (DEBUG) console.log('📱 WC URI received:', uri.substring(0, 50) + '...');
      wcUri = uri;
      onDisplayUri(uri);
    });
  }

  if (DEBUG) console.log('🔗 Requesting connection with required namespaces...');

  // Connect with REQUIRED namespaces (critical for non-blank QR)
  const session = await prov.connect({
    namespaces: requiredNamespaces,
  } as any);

  if (!session) {
    throw new Error('Failed to establish WalletConnect session');
  }

  if (DEBUG) console.log('✅ Session established:', session.topic);

  // Fetch addresses via stx_getAddresses with timeout
  let address = '';
  let publicKey: string | undefined;

  try {
    const addressResult = await Promise.race([
      prov.request<{ addresses: StxAddress[] }>({
        method: 'stx_getAddresses',
        params: {},
      }, STACKS_MAINNET),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('stx_getAddresses timeout')), 15000)
      ),
    ]);

    if (DEBUG) console.log('📬 Address result:', addressResult);

    // Find STX address (prefer symbol === 'STX', fallback to first)
    const stxEntry = addressResult.addresses?.find((a: StxAddress) => a.symbol === 'STX') 
      || addressResult.addresses?.[0];
    
    if (stxEntry) {
      address = stxEntry.address;
      publicKey = stxEntry.publicKey;
    }
  } catch (err) {
    if (DEBUG) console.warn('⚠️ stx_getAddresses failed/timeout, falling back to session accounts');
    
    // Fallback: parse from session namespaces
    const accounts = session.namespaces?.stacks?.accounts || [];
    if (accounts.length > 0) {
      // Format: "stacks:1:SP..."
      const parts = accounts[0].split(':');
      address = parts[2] || parts[0];
    }
  }

  if (!address) {
    throw new Error('Could not determine Stacks address from wallet');
  }

  return { session, address, publicKey };
}

// Disconnect the current session
export async function wcDisconnect(): Promise<void> {
  if (!provider) return;

  try {
    const session = provider.session;
    if (session) {
      await provider.disconnect();
    }
  } catch (err) {
    if (DEBUG) console.warn('Disconnect error:', err);
  }

  wcUri = null;
}

// Sign a transaction via WalletConnect
export async function wcSignTransaction(
  txHex: string,
  broadcast = true
): Promise<{ txid?: string; signedTxHex?: string }> {
  if (!provider || !provider.session) {
    throw new Error('WalletConnect not connected');
  }

  if (DEBUG) console.log('📝 Requesting transaction signature...');

  const result = await provider.request<{ txid?: string; signedTxHex?: string }>({
    method: 'stx_signTransaction',
    params: {
      transaction: txHex,
      broadcast,
    },
  }, STACKS_MAINNET);

  if (DEBUG) console.log('✅ Transaction result:', result);

  return result;
}

// Call a contract method via WalletConnect (alternative to building tx locally)
export async function wcCallContract(params: {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: string[];
  postConditions?: string[];
  stxAmount?: number;
}): Promise<{ txid: string }> {
  if (!provider || !provider.session) {
    throw new Error('WalletConnect not connected');
  }

  if (DEBUG) console.log('📞 Calling contract:', params.contractName, params.functionName);

  const result = await provider.request<{ txid: string }>({
    method: 'stx_callContract',
    params: {
      ...params,
      network: 'mainnet',
      broadcast: true,
    },
  }, STACKS_MAINNET);

  if (DEBUG) console.log('✅ Contract call result:', result);

  return result;
}

// Get the current WC URI (for QR display)
export function getWcUri(): string | null {
  return wcUri;
}

// Check if there's an active session
export function hasActiveSession(): boolean {
  return !!provider?.session;
}

// Get the current session
export function getSession(): WCSession | null {
  return provider?.session as WCSession | null;
}
