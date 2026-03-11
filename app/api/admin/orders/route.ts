import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import type { AdminOrderListItem } from "@/lib/types/adminOrder";

function mapPaymentStatus(status: string | null): string {
  return status === "paid" ? "Paid" : "Unpaid";
}

function mapFulfillmentStatus(status: string | null): string {
  switch (status) {
    case "confirm":
      return "New";
    case "pending":
      return "Processing";
    case "fulfilled":
      return "Shipped";
    case "cancelled":
      return "Cancelled";
    default:
      return status || "New";
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("orders")
      .select(
        "id, order_number, created_at, first_name, last_name, contact, phone, total_amount, payment_status, status, payment_method, tracking"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase admin orders list error:", error);
      return NextResponse.json(
        { message: "Error fetching orders" },
        { status: 500 }
      );
    }

    const list: AdminOrderListItem[] = (data || []).map((row) => {
      const customer =
        [row.first_name, row.last_name].filter(Boolean).join(" ") || "—";
      const createdAt: string | undefined = row.created_at ?? undefined;
      const date =
        createdAt != null
          ? new Date(createdAt).toISOString().slice(0, 10)
          : "—";

      return {
        id: row.id as string,
        orderNumber: row.order_number || (row.id as string).slice(-8).toUpperCase(),
        date,
        createdAt,
        customer,
        email: row.contact || "",
        phone: row.phone || "",
        total: Number(row.total_amount ?? 0),
        paymentStatus: mapPaymentStatus(row.payment_status ?? null),
        fulfillmentStatus: mapFulfillmentStatus(row.status ?? null),
        paymentMethod: row.payment_method || "—",
        tracking: row.tracking || "",
      };
    });

    return NextResponse.json(list);
  } catch (error) {
    console.error("Error fetching orders for admin:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}

