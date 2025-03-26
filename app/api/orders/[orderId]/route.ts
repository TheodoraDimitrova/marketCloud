import clientBackend from "@/sanity/lib/clientBackend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
    const orderId = req.nextUrl.pathname.split("/").pop();
  
      const order = await clientBackend.fetch(
        `*[_type == "order" && _id == $orderId][0]`,
        { orderId }
      );
      if (!order) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order);
    } catch (error) {
      console.error("Error fetching order:", error); 
      return NextResponse.json({ message: "Error fetching order" }, { status: 500 });
    }
  }