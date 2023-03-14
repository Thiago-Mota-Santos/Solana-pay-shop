"use client";
import "./styles/globals.css";
import "./styles/App.css";
import SolanaConnect from "./wallet/SolanaConnect";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useWalletModal,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import RootLayout from "./layout";

function Container() {
  const { publicKey } = useWallet();
  const { visible } = useWalletModal();

  const renderNotConnectedContainer = () => (
    <div>
      <img
        src="https://media.tenor.com/1mJ-tJSzvwsAAAAd/solana-sol.gif"
        alt="emoji"
      />
      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className="container">
        <header className="header-container">
          <p className="header"> Loja cartas digitais </p>
          <p className="sub-text">Troque suas coins por cartas</p>
        </header>

        <main>
          {publicKey ? "Conectado" : renderNotConnectedContainer()}

          {/* <img
            className="gif-image"
            src="https://media.tenor.com/1mJ-tJSzvwsAAAAd/solana-sol.gif"
            alt="emoji"
          /> */}
        </main>

        <div className="footer-container">
          {/* <img
            alt="Twitter Logo"
            className="twitter-logo"
            src="twitter-logo.svg"
          /> */}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SolanaConnect>
        <Container />
      </SolanaConnect>
    </>
  );
}
