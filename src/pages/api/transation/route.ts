import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction
} from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from "@solana/spl-token"
import BigNumber from "bignumber.js";
import { NextApiRequest, NextApiResponse } from "next";
import products from "../product/products.json"

const sellerAddress = 'B4MEn4i4ZxwtszeJLLihvSuyEEBGKZPz4eh2D2XvVQDa'
const sellerPublicKey = new PublicKey(sellerAddress);
const usdcAddress = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');


const createTransaction = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const { buyer, orderID, itemID } = request.body;

    if (!buyer) {
      return response.status(400).json({
        message: "Missing buyer addresponses",
      });
    }

    if (!orderID) {
      return response.status(400).json({
        message: "Missing order ID",
      });
    }

    const itemPrice = products.find((item) => item.id === itemID)?.price;

    if (!itemPrice) {
      return response.status(404).json({
        message: "Item não encontrado. Por favor, verifique o ID do item",
      });
    }



    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);


    const buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
    const shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);
    const { blockhash } = await connection.getLatestBlockhash("finalized");

    const usdcMint = await getMint(connection, usdcAddress);


    
    const tx = new Transaction({
      blockhash: blockhash,
      feePayer: buyerPublicKey,
      lastValidBlockHeight: 300

    });

   
    
    const transferInstruction = createTransferCheckedInstruction(
      buyerUsdcAddress,
      usdcAddress,
      shopUsdcAddress,
      buyerPublicKey,
      bigAmount.toNumber() * 10 ** (usdcMint).decimals,
      usdcMint.decimals

    )

    transferInstruction.keys.push({
      pubkey: new PublicKey(orderID), 
      isSigner: false,
      isWritable: false,
    });

    tx.add(transferInstruction);


    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });
    const base64 = serializedTransaction.toString("base64");

    response.status(200).json({
      transaction: base64,
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({ error: "error creating tx" });
    return;
  }
}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "POST") {
    createTransaction(request, response);
  } else {
    response.status(405).end();
  }
}