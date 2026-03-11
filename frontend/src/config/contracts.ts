// ChainStamp Contract Configuration
export const CONTRACT_ADDRESS = "SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT";

export const CONTRACTS = {
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
