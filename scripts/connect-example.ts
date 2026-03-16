import { openContractCall, showConnect } from "@stacks/connect";
import { stringUtf8CV } from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const network = new StacksTestnet();
/**
 * Update this with your deployed contract address.
 * You can get this from the Clarinet deployments or logs.
 */
const CONTRACT_ADDRESS = "YOUR_DEPLOYER_ADDRESS";

/**
 * Configuration for the Stacks Connect authentication window.
 */
const appDetails = {
  name: "ChainStamps",
  icon: "https://chainstamps.local/logo.png"
};

/**
 * Trigger the Stacks Connect authentication flow.
 * Prompts the user to connect their wallet (e.g., Hiro, Xverse).
 */
export function connectWallet() {
  showConnect({
    appDetails,
    onFinish: data => {
      console.log("Connected:", data);
    }
  });
}

/**
 * Example function to stamp a message on-chain using a connected wallet.
 * @param message The UTF-8 string message to record permanently.
 */
export async function stampMessageWithWallet(message: string) {
  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: "stamp-registry",
    functionName: "stamp-message",
    functionArgs: [stringUtf8CV(message)],
    network,
    onFinish: data => {
      console.log("Transaction sent:", data);
    }
  });
}
