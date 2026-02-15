import clientBackend from "@/sanity/lib/clientBackend";
import { sanityOrderToDetail } from "@/lib/services/adminOrders";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ORDER_DETAIL_QUERY, ADMIN_ORDER_STATUS_QUERY } from "@/sanity/queries";

/** Map admin fulfillment label to Sanity order status */
const fulfillmentToStatus: Record<string, string> = {
  New: "confirm",
  Processing: "pending",
  Shipped: "fulfilled",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = await clientBackend.fetch<unknown>(ADMIN_ORDER_DETAIL_QUERY, { id: orderId });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const detail = sanityOrderToDetail(order as Parameters<typeof sanityOrderToDetail>[0]);
    return NextResponse.json(detail);
  } catch (error) {
    console.error("Error fetching order for admin:", error);
    return NextResponse.json(
      { message: "Error fetching order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await req.json();
    const { tracking, fulfillmentStatus, paymentStatus } = body as {
      tracking?: string;
      fulfillmentStatus?: string;
      paymentStatus?: string;
    };

    const existing = await clientBackend.fetch<{ _id: string; status?: string; paymentStatus?: string } | null>(
      ADMIN_ORDER_STATUS_QUERY,
      { id: orderId }
    );
    if (!existing) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const patch = clientBackend.patch(orderId);
    if (tracking !== undefined) patch.set({ tracking: tracking ?? "" });
    if (paymentStatus !== undefined && (paymentStatus === "paid" || paymentStatus === "unpaid")) {
      patch.set({ paymentStatus });
    }
    // When saving a tracking number, auto-set order to Shipped (fulfilled)
    const hasTracking = typeof tracking === "string" && tracking.trim() !== "";
    if (hasTracking) {
      patch.set({ status: "fulfilled" });
      // Preserve payment status for old docs that only had status "paid"
      if (existing.status === "paid" && existing.paymentStatus === undefined) {
        patch.set({ paymentStatus: "paid" });
      }
    } else if (fulfillmentStatus !== undefined) {
      const status = fulfillmentToStatus[fulfillmentStatus] ?? fulfillmentStatus;
      patch.set({ status });
    }
    await patch.commit();

    const updated = await clientBackend.fetch<unknown>(ADMIN_ORDER_DETAIL_QUERY, {
      id: orderId,
    });
    const detail = sanityOrderToDetail(
      updated as Parameters<typeof sanityOrderToDetail>[0]
    );
    return NextResponse.json(detail);
  } catch (error) {
    console.error("Error updating order for admin:", error);
    return NextResponse.json(
      { message: "Error updating order" },
      { status: 500 }
    );
  }
}
