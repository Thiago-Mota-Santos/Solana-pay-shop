import type { NextApiRequest, NextApiResponse } from "next";
import products from "../product/products.json";

export async function GET(request: NextApiResponse, response: NextApiResponse) {
    const productsNoHashes = products.map(product => {
      const { hash, filename, ...rest } = product;
      return rest;
      
    });
  
      response.status(200).json(productsNoHashes)
    
  }

