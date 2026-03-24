import {
  CHAINSTAMP_FEES,
  DEFAULT_CONTRACT_ADDRESS,
  DEFAULT_CONTRACT_NAMES,
  DEFAULT_NETWORK,
} from '@bamzzstudio/chainstamps-sdk';

const MICROSTX_PER_STX = 1_000_000;

const microStxToStx = (microStx: bigint): number => Number(microStx) / MICROSTX_PER_STX;

/**
 * The base Stacks address for the ChainStamp contracts.
 * @constant {string}
 */
export const CONTRACT_ADDRESS = DEFAULT_CONTRACT_ADDRESS;
export const BASE_NETWORK_FEE_STX = 0.001;

/**
 * Interface for ChainStamp registry contract configuration.
 */
export interface RegistryConfig {
  /** The human-readable name of the contract. */
  name: string;
  /** The fully qualified principal address and contract name. */
  address: string;
  /** Contract fee in STX (excludes base network fee). */
  fee: number;
}

/**
 * Central configuration for the various ChainStamp registries.
 * This object maps registry keys to their respective names, full addresses, 
 * and current contract fees in STX.
 * 
 * @constant {Record<string, RegistryConfig>}
 */
export const CONTRACTS: Record<string, RegistryConfig> = {
  hashRegistry: {
    name: DEFAULT_CONTRACT_NAMES.hash,
    address: `${CONTRACT_ADDRESS}.${DEFAULT_CONTRACT_NAMES.hash}`,
    fee: microStxToStx(CHAINSTAMP_FEES.hash.store),
  },
  stampRegistry: {
    name: "stamp-registry",
    address: `${CONTRACT_ADDRESS}.stamp-registry`,
    fee: 50000, // 0.05 STX in microSTX
  },
  tagRegistry: {
    name: DEFAULT_CONTRACT_NAMES.tag,
    address: `${CONTRACT_ADDRESS}.${DEFAULT_CONTRACT_NAMES.tag}`,
    fee: microStxToStx(CHAINSTAMP_FEES.tag.store),
  },
};

export const NETWORK = (import.meta.env.VITE_STACKS_NETWORK || "mainnet").trim().toLowerCase();
export const STACKS_API_URL = "https://api.hiro.so";
export const STACKS_API_V2_URL = `${STACKS_API_URL}/v2`;
