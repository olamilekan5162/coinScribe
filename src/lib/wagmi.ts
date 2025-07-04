import { createConfig, http } from "wagmi";
import { mainnet, polygon, arbitrum, baseSepolia } from "wagmi/chains";
import { base } from "viem/chains";
import { createWeb3Modal } from "@web3modal/wagmi/react";

// Get projectId from environment variables
const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo-project-id";

// Create wagmi config
export const config = createConfig({
  chains: [mainnet, polygon, arbitrum, baseSepolia, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});
