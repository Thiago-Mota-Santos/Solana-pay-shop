"use client";
import "./styles/globals.css";
import "./styles/App.css";
import SolanaConnect from "./wallet/SolanaConnect";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import Product, { ProductProps } from "./components/products";
import {
  useWalletModal,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import RootLayout from "./layout";
import { useEffect, useState } from "react";

function Container() {
  const { publicKey } = useWallet();
  const [products, setProducts] = useState<ProductProps[]>();

  useEffect(() => {
    if (publicKey) {
      fetch(`../api/fetch/fetchProducts`)
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          console.log("products", data);
        });
    }
  }, [publicKey]);

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

  const renderItemBuyContainer = () => (
    <div className="products-container">
      <Product
        id={0}
        name={""}
        image_url={""}
        price={0}
        description={""}
        filename={""}
        hash={""}
      />
      {/* {products?.map((product) => (
        <Product
          key={product.id}
          id={product.id}
          name="aloo filho da puta"
          image_url={product.image_url}
          price={product.price}
          description={product.description}
          filename={product.filename}
          hash={product.hash}
        />
      ))} */}
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
          {/* {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()} */}
          {renderItemBuyContainer()}

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
