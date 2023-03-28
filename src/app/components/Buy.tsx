"use client";
import React, { useState, useMemo, useEffect, CSSProperties } from "react";
import { Keypair, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import IPFSDownload from "./IpfsDownload";
import { findReference, FindReferenceError } from "@solana/pay";
import MoonLoader from "react-spinners/MoonLoader";

interface BuyProps {
  itemID: number;
}

const STATUS = {
  Initial: "Initial",
  Submitted: "Submitted",
  Paid: "Paid",
};

export const override: CSSProperties = {
  marginRight: "55px",
  cursor: "not-allowed",
};

export default function Buy({ itemID }: BuyProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(STATUS.Initial);

  const order = useMemo(
    () => ({
      buyer: publicKey?.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch(`api/transation/route`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    const txData = await txResponse.json();
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));

    console.log("Tx data is", tx);

    try {
      const txHash = await sendTransaction(tx, connection);
      console.log(
        `Transação enviada: https://solscan.io/tx/${txHash}?cluster=devnet`
      );
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log(`TX reference ${result.confirmationStatus}`);

          if (
            result.confirmationStatus === "confirmed" ||
            result.confirmationStatus === "finalized"
          ) {
            clearInterval(interval);
            setStatus(STATUS.Paid);
            setLoading(false);
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.log(`Error: ${e}`);
        } finally {
          setLoading(false);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
        alert("Obrigado por sua compra!");
      };
    }
  }, [status]);

  if (!publicKey) {
    return (
      <div>
        <p>É necessário conectar sua carteira para realizar a transação</p>
      </div>
    );
  }

  if (loading) {
    return <MoonLoader cssOverride={override} size={30} color="gray" />;
  }

  return (
    <div>
      {status === STATUS.Paid ? (
        <IPFSDownload
          filename="JojoArts.zip"
          hash="QmPN21PtsnAwcaU9XbmEVieH2ScgXKwTSM4sAZHemfKK7Q"
        />
      ) : (
        <button
          disabled={loading}
          className="buy-button"
          onClick={processTransaction}
        >
          Compre agora
        </button>
      )}
    </div>
  );
}
