import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
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

    const { data, error } = await supabaseServer
      .from("product_reviews")
      .select(
        "id, product_id, author, email, rating, comment, status, created_at, updated_at"
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews from Supabase:", error);
      return NextResponse.json(
        { message: "Error fetching reviews" },
        { status: 500 }
      );
    }

    const reviews: Review[] =
      data?.map((row) => ({
        _id: row.id as string,
        product: {
          _ref: row.product_id,
          _type: "reference",
        },
        author: row.author,
        email: row.email,
        rating: row.rating,
        comment: row.comment,
        status: row.status ?? undefined,
        _createdAt: row.created_at as string,
        _updatedAt: row.updated_at as string,
      })) ?? [];

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Error fetching reviews", error },
      { status: 500 }
    );
  }
}
