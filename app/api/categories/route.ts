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
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
