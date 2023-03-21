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
import { NextResponse } from "next/server";

const sellerAddress = 'B4MEn4i4ZxwtszeJLLihvSuyEEBGKZPz4eh2D2XvVQDa';
const sellerPublicKey = new PublicKey(sellerAddress);

export async function POST (request: NextApiRequest, response: NextApiResponse) {

    
     

        const network = WalletAdapterNetwork.Devnet;
        const endPoint = clusterApiUrl(network);
         console.log(endPoint);
        const connection = new Connection(endPoint, {httpHeaders: {
            'Content-Type': 'application/json'
        }})

    

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
    console.log(itemPrice);
   
    
    if(!itemPrice){
        return response.status(404).json({
            message: "Item not found, please, verify the item Id",
        });
    };
        const bigAmount = BigNumber(itemPrice);
        const buyerPublicKey = new PublicKey(buyer);
        

       const { blockhash } = await connection.getLatestBlockhash("finalized");
       console.log(blockhash);

      

    //    const tx = new Transaction({

    //     recentBlockhash: blockhash,
    //     feePayer: buyerPublicKey,
    //    });


       const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: buyerPublicKey,
            toPubkey: sellerPublicKey,
            lamports: bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),

        })
       )


    //  const tx = new Transaction({
    //     blockhash: blockhash,
    //     feePayer: buyerPublicKey,
    //     lastValidBlockHeight: 60
    //  });

    //    const transferInstruction = SystemProgram.transfer({
    //     fromPubkey: buyerPublicKey,
    //     lamports: bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
    //     toPubkey: sellerPublicKey,
    //    });
       
    //    transferInstruction.keys.push({
    //     pubkey: new PublicKey(orderId),
    //     isSigner: false,
    //     isWritable: false,
    //    });

    //    tx.add(transferInstruction);

       const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
       });

  

       const base64 = serializedTransaction.toString('base64');

       return response.status(200).json({
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
// }

// export default function GET(request: NextApiRequest, response: NextApiResponse) {
//       console.log('será que essa função de filho da puta é chamada, veja e descubra');
//     //   createTransaction(request, response);


//     const lel = 'eai'

//     return NextResponse.json({ lel })
    
    
//   }

// export async function POST(request: NextApiRequest, response: NextApiResponse) {
//     console.log('chegou')
//     createTransaction(request, response)
//   }



// export default function POST(request: NextApiRequest, response: NextApiResponse){


