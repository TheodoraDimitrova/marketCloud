import { NextResponse } from "next/server";
import client from "@/sanity/lib/client";

export async function GET() {
  try {
    const products = await client.fetch(`*[_type == "product"]`);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
