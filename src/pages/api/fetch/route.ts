
import products from '../product/products.json'
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "GET") {
    const productsNoHashes = products.map((product) => {

      const { hash, filename, ...rest } = product;
      return rest;
    });

    response.status(200).json(productsNoHashes); 
  }
  else {
    response.status(405).send(`Method ${request.method} not allowed`);
  }
}
