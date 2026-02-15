import { NextRequest, NextResponse } from "next/server";
import clientBackend from "@/sanity/lib/clientBackend";
import { Review } from "@/lib/types/review";
import { REVIEWS_BY_PRODUCT_QUERY } from "@/sanity/queries";

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

    const reviews: Review[] = await clientBackend.fetch(REVIEWS_BY_PRODUCT_QUERY, { productId });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Error fetching reviews", error },
      { status: 500 }
    );
  }
}
