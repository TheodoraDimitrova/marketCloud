import { NextResponse } from "next/server";
import client from "@/sanity/lib/client";

export async function GET() {
  try {
    const categories = await client.fetch(`*[_type == "category"]{
        ...,
        "totalProducts": count(*[_type == "product" && references(^._id)])
      }`);
    return NextResponse.json(categories);
  } catch (error) {
    const isNetworkError =
      error instanceof TypeError && error.message === "fetch failed";
    return NextResponse.json(
      {
        message: isNetworkError
          ? "No internet connection. Please check your network."
          : "Failed to load categories.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
