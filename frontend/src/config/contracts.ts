// ChainStamp Contract Configuration
export const CONTRACT_ADDRESS = "SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT";

export const CONTRACTS = {
  hashRegistry: {
    name: "hash-registry",
    address: `${CONTRACT_ADDRESS}.hash-registry`,
    fee: 30000, // 0.03 STX in microSTX (HASH-FEE)
  },
  stampRegistry: {
    name: "stamp-registry",
    address: `${CONTRACT_ADDRESS}.stamp-registry`,
    fee: 50000, // 0.05 STX in microSTX (STAMP-FEE)
  },
  tagRegistry: {
    name: "tag-registry",
    address: `${CONTRACT_ADDRESS}.tag-registry`,
    fee: 40000, // 0.04 STX in microSTX (TAG-FEE)
  },
};

export const NETWORK = "mainnet";
export const STACKS_API_URL = "https://api.hiro.so";
