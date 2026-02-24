import clientBackend from "@/sanity/lib/clientBackend";
import { NextResponse } from "next/server";
import { PRODUCTS_QUERY } from "@/sanity/queries";

export async function GET() {
  try {
    const products = await clientBackend.fetch<unknown[]>(PRODUCTS_QUERY);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products for admin:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}
