"use client";
import { Children, ReactNode, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  useWalletModal,
  WalletModalContext,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { WalletModalContextState } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import RootLayout from "../layout";
import Home from "../page";

interface SolanaProps {
  children: ReactNode;
}

function SolanaConnect({ children }: SolanaProps) {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider> {children} </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default function ContextProvider({ children }: SolanaProps) {
  return <SolanaConnect>{children}</SolanaConnect>;
}
