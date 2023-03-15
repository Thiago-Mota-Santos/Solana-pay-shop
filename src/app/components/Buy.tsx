import { useState, useMemo } from "react";

import { Keypair, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InfinitySpin } from "react-loader-spinner";

import IPFSDownload from "./IpfsDownload";

interface BuyProps {
  itemId: number;
}

export default function Buy({ itemId }: BuyProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []);

  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const order = useMemo(
    () => ({
      buyer: publicKey?.toString(),
      orderID: orderID.toString(),
      itemId: itemId,
    }),
    [publicKey, orderID, itemId]
  );

  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch("../api/transation/createTransaction", {
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

      setPaid(true);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div>
        <p>CONECTE SUA CARTEIRA PARA REALIZAR A TRANSAÇÃO</p>
      </div>
    );
  }

  if (loading) {
    <InfinitySpin color="gray" />;
  }

  return (
    <div>
      {paid ? (
        <IPFSDownload
          filename="emojis.zip"
          hash="QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5"
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
