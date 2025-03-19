import clientBackend from "@/sanity/lib/clientBackend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
    try {
      console.log("Attempting to fetch order with orderId:", params.orderId); 
      
      const order = await clientBackend.fetch(
        `*[_type == "order" && _id == $orderId][0]`,
        { orderId: params.orderId }
      );
  
      if (!order) {
        console.log("No order found");
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
      }
  
      console.log("Order fetched successfully:", order);
      return NextResponse.json(order);
    } catch (error) {
      console.error("Error fetching order:", error); // Лог на грешката
      return NextResponse.json({ message: "Error fetching order" }, { status: 500 });
    }
  }