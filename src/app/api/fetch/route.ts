import { NextResponse } from "next/server";
import products from "../product/products.json";

export async function GET() {
    const productsNoHashes = products.map(product => {
      const { hash, filename, ...rest } = product;
      return rest;
      
    });
  
      return NextResponse.json({ productsNoHashes })
    
  }

