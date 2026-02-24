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

    // Validate tracking number - must contain only digits
    if (tracking !== undefined && tracking !== null && tracking !== "") {
      if (!/^\d+$/.test(tracking.trim())) {
        return NextResponse.json(
          { message: "Tracking number must contain only numbers" },
          { status: 400 }
        );
      }
    }

    const existing = await clientBackend.fetch<{ _id: string; status?: string; paymentStatus?: string } | null>(
      ADMIN_ORDER_STATUS_QUERY,
      { id: orderId }
    );
    if (!existing) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const patch = clientBackend.patch(orderId);
    if (tracking !== undefined) {
      // Store trimmed tracking number, or empty string if null/empty
      const trimmedTracking = tracking?.trim() ?? "";
      patch.set({ tracking: trimmedTracking });
    }
    
    // Determine the new payment status
    const newPaymentStatus = paymentStatus !== undefined 
      ? (paymentStatus === "paid" || paymentStatus === "unpaid" ? paymentStatus : existing.paymentStatus)
      : existing.paymentStatus;
    
    if (paymentStatus !== undefined && (paymentStatus === "paid" || paymentStatus === "unpaid")) {
      patch.set({ paymentStatus: newPaymentStatus });
    }
    
    // When saving a tracking number, auto-set order to Shipped (fulfilled)
    const hasTracking = typeof tracking === "string" && tracking.trim() !== "";
    if (hasTracking) {
      patch.set({ status: "fulfilled" });
      // Preserve payment status for old docs that only had status "paid"
      if (existing.status === "paid" && existing.paymentStatus === undefined) {
        patch.set({ paymentStatus: "paid" });
      }
    } else if (paymentStatus === "paid" && existing.paymentStatus !== "paid") {
      // When marking order as paid, automatically set status to Processing (pending)
      // Only if it's not already Shipped (fulfilled)
      if (existing.status !== "fulfilled") {
        patch.set({ status: "pending" });
      }
    } else if (fulfillmentStatus !== undefined) {
      // Manual fulfillment status change (from dropdown)
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
