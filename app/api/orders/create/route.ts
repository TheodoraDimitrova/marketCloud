import { NextRequest, NextResponse } from "next/server";
import { CartItem } from "@/lib/types/cart";
import { supabaseServer } from "@/lib/supabase/server";

const MIN_ORDER_NUMBER = 1000;

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    let nextNumber = MIN_ORDER_NUMBER;
    const { data: lastOrders, error: lastError } = await supabaseServer
      .from("orders")
      .select("order_number, created_at")
      .order("created_at", { ascending: false })
      .limit(1);

    if (!lastError && lastOrders && lastOrders.length > 0) {
      const last = lastOrders[0];
      const parsed = parseInt(last.order_number ?? "", 10);
      if (!Number.isNaN(parsed)) {
        nextNumber = Math.max(parsed + 1, MIN_ORDER_NUMBER);
      }
    }

    const orderNumber = String(nextNumber);

    const paymentStatus =
      orderData.paymentMethod === "card" ? "paid" : "unpaid";
    const status = orderData.paymentMethod === "card" ? "pending" : "confirm";

    const { data: insertedOrders, error: orderInsertError } =
      await supabaseServer
        .from("orders")
        .insert({
          order_number: orderNumber,
          contact: orderData.contact,
          subscribed: orderData.subscribed,
          country: orderData.country,
          first_name: orderData.firstName,
          last_name: orderData.lastName,
          address: orderData.address,
          postal_code: orderData.postalCode,
          city: orderData.city,
          phone: orderData.phone,
          payment_method: orderData.paymentMethod,
          payment_status: paymentStatus,
          subtotal: orderData.subtotal,
          total_savings: orderData.totalSavings,
          total_amount: orderData.totalAmount,
          shipping_method: orderData.shipping?.method ?? null,
          shipping_cost: orderData.shipping?.cost ?? 0,
          shipping_label: orderData.shipping?.label ?? null,
          status,
          tracking: null,
        })
        .select("*")
        .limit(1);

    if (orderInsertError || !insertedOrders || insertedOrders.length === 0) {
      console.error("Supabase orders insert error:", orderInsertError);
      return NextResponse.json(
        { message: "Error creating order" },
        { status: 500 },
      );
    }

    const orderRow = insertedOrders[0];

    // Insert order items
    const itemsPayload = (
      orderData.cart as Array<CartItem & { _id?: string }>
    ).map((item) => ({
      order_id: orderRow.id,
      product_id: item._id ?? null,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      discounted_price: item.discountedPrice ?? null,
      subtotal_single_product: item.subtotalSingleProduct ?? null,
      total_price: item.totalPrice ?? null,
      discount: item.discount
        ? {
            isActive: item.discount.isActive,
            amount: item.discount.amount,
            type: item.discount.type,
          }
        : null,
    }));

    const { error: itemsInsertError } = await supabaseServer
      .from("order_items")
      .insert(itemsPayload);

    if (itemsInsertError) {
      console.error("Supabase order_items insert error:", itemsInsertError);
    }

    // Create / update contact in Supabase (public.contacts) when contact is an email
    try {
      const contactStr =
        typeof orderData.contact === "string"
          ? orderData.contact.trim()
          : "";

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailPattern.test(contactStr);

      if (isEmail) {
        const emailTrimmed = contactStr.toLowerCase();
        const name =
          [orderData.firstName, orderData.lastName]
            .filter(Boolean)
            .join(" ") || null;

        const { data: existingContact, error: contactFetchError } =
          await supabaseServer
            .from("contacts")
            .select("id, subscribed, name")
            .eq("email", emailTrimmed)
            .maybeSingle();

        if (
          contactFetchError &&
          // PGRST116 = no rows, which is fine (we'll create)
          contactFetchError.code !== "PGRST116"
        ) {
          console.error(
            "Supabase contacts fetch error:",
            contactFetchError
          );
        } else if (existingContact) {
          const updates: Record<string, unknown> = {};
          if (orderData.subscribed && !existingContact.subscribed) {
            updates.subscribed = true;
          }
          if (name && !existingContact.name) {
            updates.name = name;
          }

          if (Object.keys(updates).length > 0) {
            const { error: contactUpdateError } = await supabaseServer
              .from("contacts")
              .update(updates)
              .eq("id", existingContact.id);

            if (contactUpdateError) {
              console.error(
                "Supabase contacts update error:",
                contactUpdateError
              );
            }
          }
        } else {
          const { error: contactInsertError } = await supabaseServer
            .from("contacts")
            .insert({
              email: emailTrimmed,
              name,
              phone: orderData.phone,
              source: "order",
              subscribed: Boolean(orderData.subscribed),
            });

          if (contactInsertError) {
            console.error(
              "Supabase contacts insert error:",
              contactInsertError
            );
          }
        }
      }
    } catch (e) {
      console.error("Supabase contact sync failed:", e);
    }

    // Shape response like existing Order type
    const createdOrder = {
      cart: orderData.cart as CartItem[],
      subtotal: orderData.subtotal,
      totalSavings: orderData.totalSavings,
      totalAmount: orderData.totalAmount,
      shipping: orderData.shipping,
      status,
      contact: orderData.contact,
      subscribed: orderData.subscribed,
      country: orderData.country,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      address: orderData.address,
      postalCode: orderData.postalCode,
      city: orderData.city,
      phone: orderData.phone,
      deliveryMethod: orderData.shipping?.method ?? "",
      paymentMethod: orderData.paymentMethod,
      _id: orderRow.id as string,
      _updatedAt: orderRow.created_at as string,
      orderNumber,
    };

    return NextResponse.json({
      message: "Order created successfully",
      createdOrder,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error creating order", error },
      { status: 500 },
    );
  }
}
