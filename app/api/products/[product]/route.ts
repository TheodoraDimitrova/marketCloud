import { NextResponse } from "next/server";
import client from "@/sanity/lib/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const parts = url.pathname.split("/");
    const productId = parts[parts.length - 1];

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID not provided" },
        { status: 400 }
      );
    }

    const query = `*[_type == "product" && slug.current == $slug][0]`;
    const product = await client.fetch(query, { slug: productId });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch product details",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
