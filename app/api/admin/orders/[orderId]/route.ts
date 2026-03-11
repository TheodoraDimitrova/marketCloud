import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import type { AdminOrderDetail } from "@/lib/types/adminOrder";

/** Map admin fulfillment label to DB order status */
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
    const { data: orderRow, error: orderError } = await supabaseServer
      .from("orders")
      .select(
        "id, order_number, created_at, first_name, last_name, contact, phone, total_amount, payment_status, status, payment_method, tracking, subtotal, total_savings, address, city, postal_code, country, shipping_method, shipping_cost, shipping_label"
      )
      .eq("id", orderId)
      .single();

    if (orderError || !orderRow) {
      if (orderError?.code === "PGRST116") {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
      }
      console.error("Supabase admin order detail error:", orderError);
      return NextResponse.json(
        { message: "Error fetching order" },
        { status: 500 }
      );
    }

    const { data: items, error: itemsError } = await supabaseServer
      .from("order_items")
      .select("product_name, quantity, price, discounted_price, discount")
      .eq("order_id", orderRow.id);

    if (itemsError) {
      console.error("Supabase admin order items error:", itemsError);
      return NextResponse.json(
        { message: "Error fetching order items" },
        { status: 500 }
      );
    }

    const customer =
      [orderRow.first_name, orderRow.last_name].filter(Boolean).join(" ") || "—";
    const createdAt: string | undefined = orderRow.created_at ?? undefined;
    const date =
      createdAt != null
        ? new Date(createdAt).toISOString().slice(0, 10)
        : "—";

    const paymentStatusLabel =
      (orderRow.payment_status ?? "unpaid") === "paid" ? "Paid" : "Unpaid";

    const fulfillmentStatusLabel = (() => {
      switch (orderRow.status) {
        case "confirm":
          return "New";
        case "pending":
          return "Processing";
        case "fulfilled":
          return "Shipped";
        case "cancelled":
          return "Cancelled";
        default:
          return orderRow.status || "New";
      }
    })();

    const mappedItems: AdminOrderDetail["items"] = (items || []).map((item) => {
      const originalPrice = Number(item.price ?? 0);
      const discountedPrice = Number(item.discounted_price ?? originalPrice);
      const hasDiscount = discountedPrice < originalPrice;

      let discountAmount: number | undefined;
      let discountType: string | undefined;

      const discountObj = item.discount as
        | { amount?: number; type?: string; isActive?: boolean }
        | null
        | undefined;

      if (discountObj?.isActive && discountObj.amount) {
        discountAmount = discountObj.amount;
        discountType = discountObj.type;
      } else if (hasDiscount && originalPrice > 0) {
        const value = originalPrice - discountedPrice;
        const percent = (value / originalPrice) * 100;
        discountAmount = Math.round(percent * 100) / 100;
        discountType = "percentage";
      }

      return {
        product: item.product_name || "—",
        variant: "",
        qty: item.quantity ?? 1,
        price: discountedPrice,
        originalPrice: hasDiscount ? originalPrice : undefined,
        discount: hasDiscount ? originalPrice - discountedPrice : undefined,
        discountAmount,
        discountType,
      };
    });

    const detail: AdminOrderDetail = {
      id: orderRow.id as string,
      orderNumber:
        orderRow.order_number || (orderRow.id as string).slice(-8).toUpperCase(),
      date,
      createdAt,
      customer,
      email: orderRow.contact || "",
      phone: orderRow.phone || "",
      total: Number(orderRow.total_amount ?? 0),
      paymentStatus: paymentStatusLabel,
      fulfillmentStatus: fulfillmentStatusLabel,
      paymentMethod: orderRow.payment_method || "—",
      tracking: orderRow.tracking || "",
      subtotal: orderRow.subtotal ?? undefined,
      totalSavings: orderRow.total_savings ?? undefined,
      shippingAddress: {
        address: orderRow.address || "",
        city: orderRow.city || "",
        zip: orderRow.postal_code || "",
        country: orderRow.country || "",
      },
      shipping: {
        method: orderRow.shipping_method ?? null,
        cost: orderRow.shipping_cost ?? 0,
        label: orderRow.shipping_label ?? "",
      },
      items: mappedItems,
      notes: [],
    };

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

    const { data: existing, error: existingError } = await supabaseServer
      .from("orders")
      .select("status, payment_status")
      .eq("id", orderId)
      .single();

    if (existingError || !existing) {
      if (existingError?.code === "PGRST116") {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
      }
      console.error("Supabase admin order status fetch error:", existingError);
      return NextResponse.json(
        { message: "Error fetching order" },
        { status: 500 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (tracking !== undefined) {
      const trimmedTracking = tracking?.trim() ?? "";
      updates.tracking = trimmedTracking;
      const hasTracking = trimmedTracking !== "";
      if (hasTracking) {
        updates.status = "fulfilled";
      }
    }

    if (
      paymentStatus !== undefined &&
      (paymentStatus === "paid" || paymentStatus === "unpaid")
    ) {
      updates.payment_status = paymentStatus;
      if (
        paymentStatus === "paid" &&
        existing.status !== "fulfilled" &&
        !updates.status
      ) {
        updates.status = "pending";
      }
    }

    if (fulfillmentStatus !== undefined && !updates.status) {
      const mappedStatus =
        fulfillmentToStatus[fulfillmentStatus] ?? fulfillmentStatus;
      updates.status = mappedStatus;
    }

    const { error: updateError } = await supabaseServer
      .from("orders")
      .update(updates)
      .eq("id", orderId);

    if (updateError) {
      console.error("Supabase admin order update error:", updateError);
      return NextResponse.json(
        { message: "Error updating order" },
        { status: 500 }
      );
    }

    const fakeReq = new NextRequest(req.url, { method: "GET" });
    return await GET(fakeReq, { params: Promise.resolve({ orderId }) });
  } catch (error) {
    console.error("Error updating order for admin:", error);
    return NextResponse.json(
      { message: "Error updating order" },
      { status: 500 }
    );
  }
}
