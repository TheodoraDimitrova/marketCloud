import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get("orderNumber");
  if (!orderNumber) {
    return NextResponse.json(
      { message: "orderNumber required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("orders")
    .select("id, order_number, status, created_at, updated_at, shipping_method, tracking")
    .eq("order_number", orderNumber)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { message: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
