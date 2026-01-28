import { openContractCall, showConnect } from "@stacks/connect";
import { stringUtf8CV } from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

const network = new StacksTestnet();
const CONTRACT_ADDRESS = "YOUR_DEPLOYER_ADDRESS";

const appDetails = {
  name: "ChainStamps",
  icon: "https://chainstamps.local/logo.png"
};

export function connectWallet() {
  showConnect({
    appDetails,
    onFinish: data => {
      console.log("Connected:", data);
    }
  });
}

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
