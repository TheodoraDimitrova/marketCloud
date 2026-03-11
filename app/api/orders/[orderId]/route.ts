import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.pathname.split("/").pop();

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    const { data: orderRow, error: orderError } = await supabaseServer
      .from("orders")
      .select(
        "id, order_number, contact, subscribed, country, first_name, last_name, address, postal_code, city, phone, payment_method, payment_status, subtotal, total_savings, total_amount, shipping_method, shipping_cost, shipping_label, status, created_at, updated_at"
      )
      .eq("id", orderId)
      .single();

    if (orderError) {
      if (orderError.code === "PGRST116") {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }
      console.error("Supabase order fetch error:", orderError);
      return NextResponse.json(
        { message: "Error fetching order" },
        { status: 500 }
      );
    }

    if (!orderRow) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const { data: items, error: itemsError } = await supabaseServer
      .from("order_items")
      .select(
        "product_id, product_name, quantity, price, discounted_price, subtotal_single_product, total_price, discount"
      )
      .eq("order_id", orderRow.id);

    if (itemsError) {
      console.error("Supabase order_items fetch error:", itemsError);
      return NextResponse.json(
        { message: "Error fetching order items" },
        { status: 500 }
      );
    }

    const cart = (items || []).map((item) => ({
      _id: item.product_id ?? undefined,
      name: item.product_name,
      images: [], // no images needed on thank-you page
      quantity: item.quantity,
      price: item.price,
      discountedPrice: item.discounted_price ?? undefined,
      subtotalSingleProduct: item.subtotal_single_product ?? undefined,
      totalPrice: item.total_price ?? undefined,
      discount: item.discount ?? undefined,
    }));

    const order = {
      cart,
      subtotal: Number(orderRow.subtotal ?? 0),
      totalSavings: Number(orderRow.total_savings ?? 0),
      totalAmount: Number(orderRow.total_amount ?? 0),
      shipping: {
        method: orderRow.shipping_method,
        cost: Number(orderRow.shipping_cost ?? 0),
        label: orderRow.shipping_label,
      },
      status: orderRow.status,
      contact: orderRow.contact,
      subscribed: orderRow.subscribed,
      country: orderRow.country,
      firstName: orderRow.first_name,
      lastName: orderRow.last_name,
      address: orderRow.address,
      postalCode: orderRow.postal_code,
      city: orderRow.city,
      phone: orderRow.phone,
      deliveryMethod: orderRow.shipping_method ?? "",
      paymentMethod: orderRow.payment_method,
      _id: orderRow.id as string,
      _updatedAt: orderRow.updated_at as string,
      orderNumber: orderRow.order_number,
    };

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Error fetching order" },
      { status: 500 }
    );
  }
}
