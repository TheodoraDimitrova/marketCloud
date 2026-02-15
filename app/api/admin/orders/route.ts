import clientBackend from "@/sanity/lib/clientBackend";
import { sanityOrderToListItem } from "@/lib/services/adminOrders";
import { NextResponse } from "next/server";
import { ADMIN_ORDERS_LIST_QUERY } from "@/sanity/queries";

export async function GET() {
  try {
    const orders = await clientBackend.fetch<unknown[]>(ADMIN_ORDERS_LIST_QUERY);
    const list = orders.map((o) => sanityOrderToListItem(o as Parameters<typeof sanityOrderToListItem>[0]));
    return NextResponse.json(list);
  } catch (error) {
    console.error("Error fetching orders for admin:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}
