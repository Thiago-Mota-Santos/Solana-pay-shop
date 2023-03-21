import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { NextApiRequest, NextApiResponse } from "next";
import products from "../product/products.json"

// Certifique-se de substituir isto pelo endereço de sua carteira!
const sellerAddress = 'B1aLAAe4vW8nSQCetXnYqJfRxzTjnbooczwkUJAr7yMS'
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    // Extraia os dados da transação do órgão solicitante
    const { buyer, orderID, itemID } = request.body;
    console.log(buyer, orderID, itemID);

    // Se não tivermos algo que precisamos, paramos!
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

    // Pegue o preço do item de products.json usando itemID
    const itemPrice = products.find((item) => item.id === itemID)?.price;
    console.log(itemPrice);

    if (!itemPrice) {
      return response.status(404).json({
        message: "Item não encontrado. Por favor, verifique o ID do item",
      });
    }


    // Converta nosso preço para o formato correto
    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    //Um blockhash (hash de bloco) é como uma identificação para um bloco. Ele permite que você identifique cada bloco.
    const { blockhash } = await connection.getLatestBlockhash("finalized");


    // As duas primeiras coisas que precisamos - uma identificação recente do bloco 
    // e a chave pública do pagador da taxa 
    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });

    // Esta é a "ação" que a transação realizará
    // Vamos apenas transferir algum SOL
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: buyerPublicKey,
      // Lamports são a menor unidade do SOL, como a Gwei é da Ethereum
      lamports: bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber(), 
      toPubkey: sellerPublicKey,
    });

    // Estamos acrescentando mais instruções à transação
    transferInstruction.keys.push({
      // Usaremos nosso OrderId para encontrar esta transação mais tarde
      pubkey: new PublicKey(orderID), 
      isSigner: false,
      isWritable: false,
    });

    tx.add(transferInstruction);


    // Formatando nossa transação
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