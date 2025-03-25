import { NextResponse } from "next/server";
import clientBackend from "@/sanity/lib/clientBackend";

export async function GET() {
  try {
    const products = await clientBackend.fetch(`*[_type == "product"]`);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products", error },
      { status: 500 }
    );
  }
}