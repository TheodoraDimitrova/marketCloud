import client from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { ORDER_BY_ID_QUERY } from "@/sanity/queries";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.pathname.split("/").pop();

    const order = await client.fetch(ORDER_BY_ID_QUERY, { orderId });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Error fetching order" },
      { status: 500 }
    );
  }
}
