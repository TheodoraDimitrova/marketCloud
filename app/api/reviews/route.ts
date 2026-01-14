import { NextRequest, NextResponse } from "next/server";
import clientBackend from "@/sanity/lib/clientBackend";
import { Review } from "@/lib/types/review";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const query = `*[_type == "review" && product._ref == $productId] | order(_createdAt desc){
      _id,
      author,
      rating,
      comment,
      product,
      _createdAt,
      _updatedAt
    }`;

    const reviews: Review[] = await clientBackend.fetch(query, { productId });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Error fetching reviews", error },
      { status: 500 }
    );
  }
}
