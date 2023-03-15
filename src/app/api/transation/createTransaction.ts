import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
} from '@solana/web3.js'

import BigNumber from 'bignumber.js';
import products from '../product/products.json';
import type { NextApiRequest, NextApiResponse } from "next";


const sellerAddress = 'B4MEn4i4ZxwtszeJLLihvSuyEEBGKZPz4eh2D2XvVQDa';
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async (request: NextApiRequest, response: NextApiResponse) => {
    try{
        const { buyer, orderId, itemId } = request.body;

        if(!buyer){
            return response.status(400).json({
                message: 'Missing buyer address',
            });
        }
        if(!orderId){
            return response.status(400).json({
                message: "Missing Order Id"
            })
        }
    const itemPrice = products.find((item) => item.id === itemId)?.price

    if(!itemPrice){
        return response.status(404).json({
            message: "Item not found, please, verify the item Id",
        });
    };
        const bigAmount = BigNumber(itemPrice);
        const buyerPublicKey = new PublicKey(buyer);
        const network = WalletAdapterNetwork.Devnet;
        const endPoint = clusterApiUrl(network);
        const connection = new Connection(endPoint);

       const { blockhash } = await connection.getLatestBlockhash("finalized");

       const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: buyerPublicKey,
       });

       const transferInstruction = SystemProgram.transfer({
        fromPubkey: buyerPublicKey,
        lamports: bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
        toPubkey: sellerPublicKey,
       });
       
       transferInstruction.keys.push({
        pubkey: new PublicKey(orderId),
        isSigner: false,
        isWritable: false,
       });

       tx.add(transferInstruction);

       const serializedTransaction = tx.serialize({
        requireAllSignatures: false,
       });

       const base64 = serializedTransaction.toString('base64');

       response.status(200).json({
        Transaction: base64       
    });
 }catch(e){
    console.log(e);
    response.status(500).json({
        error: "Error creating Tx"
    });
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
