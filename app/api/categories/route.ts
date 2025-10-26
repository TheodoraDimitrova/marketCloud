import { NextResponse } from "next/server";
import clientBackend from "@/sanity/lib/clientBackend";

export async function GET() {
  try {
    const categories = await clientBackend.fetch(`*[_type == "category"]{
        ...,
        "totalProducts": count(*[_type == "product" && references(^._id)])
      }`);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch categories",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
