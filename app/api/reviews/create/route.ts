import clientBackend from "@/sanity/lib/clientBackend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const reviewData = await req.json();
    const { productId, name, email, comment, rating } = reviewData;

    if (!productId || !name || !email || !comment || !rating) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const createdReview = await clientBackend.create({
      _type: "review",
      product: {
        _type: "reference",
        _ref: productId,
      },
      author: name,
      email: email,
      rating: Number(rating),
      comment: comment,
    });

    return NextResponse.json({
      message: "Review created successfully",
      review: createdReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Error creating review", error },
      { status: 500 }
    );
  }
}
