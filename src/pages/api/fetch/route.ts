import products from "../../../app/kek/product/products.json"

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  // Se for solicitado
  if (request.method === "GET") {
    // Criar uma cópia dos produtos sem os hashes e nomes de arquivo
    const productsNoHashes = products.map((product) => {

      const { hash, filename, ...rest } = product;
      return rest;
    });

    response.status(200).json(productsNoHashes); 
    console.log(productsNoHashes); 
  }
  else {
    response.status(405).send(`Method ${request.method} not allowed`);
  }
}
