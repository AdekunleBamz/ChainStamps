/**
 * The base Stacks address for the ChainStamp contracts.
 * @constant {string}
 */
export const CONTRACT_ADDRESS = "SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT";

/**
 * Interface for ChainStamp registry contract configuration.
 */
export interface RegistryConfig {
  /** The human-readable name of the contract. */
  name: string;
  /** The fully qualified principal address and contract name. */
  address: string;
  /** The transaction fee in microSTX. */
  fee: number;
}

/**
 * Central configuration for the various ChainStamp registries.
 * This object maps registry keys to their respective names, full addresses, 
 * and current transaction fees in microSTX.
 * 
 * @constant {Record<string, RegistryConfig>}
 */
export const CONTRACTS: Record<string, RegistryConfig> = {
  hashRegistry: {
    name: "hash-registry",
    address: `${CONTRACT_ADDRESS}.hash-registry`,
    fee: 20000, // 0.02 STX in microSTX
  },
  stampRegistry: {
    name: "stamp-registry",
    address: `${CONTRACT_ADDRESS}.stamp-registry`,
    fee: 20000, // 0.02 STX in microSTX
  },
  tagRegistry: {
    name: "tag-registry",
    address: `${CONTRACT_ADDRESS}.tag-registry`,
    fee: 20000, // 0.02 STX in microSTX
  },
};

export const NETWORK = "mainnet";
export const STACKS_API_URL = "https://api.hiro.so";
