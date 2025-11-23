import { NextResponse } from "next/server";
import client from "@/sanity/lib/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const category = parts[parts.length - 1];

    if (!category) {
      return NextResponse.json(
        { message: "Category not provided" },
        { status: 400 }
      );
    }

    const query = '*[_type == "product" && references($category)]';
    const products = await client.fetch(query, { category });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch products by category",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
