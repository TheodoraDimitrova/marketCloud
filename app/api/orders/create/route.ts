import clientBackend from "@/sanity/lib/clientBackend";
import { NextRequest, NextResponse } from "next/server";
import { CartItem } from "@/lib/types/cart";
import { ORDER_NUMBERS_QUERY } from "@/sanity/queries";

const MIN_ORDER_NUMBER = 1000;

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    const existing = await clientBackend.fetch<string[]>(ORDER_NUMBERS_QUERY);
    const numeric = existing
      .map((s) => parseInt(s, 10))
      .filter((n) => !Number.isNaN(n));
    const max = numeric.length > 0 ? Math.max(...numeric) : MIN_ORDER_NUMBER - 1;
    const nextNumber = Math.max(max + 1, MIN_ORDER_NUMBER);
    const orderNumber = String(nextNumber);

    const createdOrder = await clientBackend.create({
      _type: "order",
      orderNumber,
      contact: orderData.contact,
      subscribed: orderData.subscribed,
      country: orderData.country,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      address: orderData.address,
      postalCode: orderData.postalCode,
      city: orderData.city,
      phone: orderData.phone,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === "card" ? "paid" : "unpaid",
      cart: orderData.cart.map((item: CartItem, index: number) => ({
        name: item.name,
        _key: `cartItem-${Date.now()}-${index}`,
        _type: "cartItem",
        images: [item.images[0]],
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item.discountedPrice,
        subtotalSingleProduct: item.subtotalSingleProduct,
        totalPrice: item.totalPrice,
        discount: item.discount,
      })),
      subtotal: orderData.subtotal,
      totalSavings: orderData.totalSavings,
      totalAmount: orderData.totalAmount,
      shipping: orderData.shipping,
      // If paid with card, automatically set status to Processing (pending)
      // Otherwise, set to New (confirm)
      status: orderData.paymentMethod === "card" ? "pending" : "confirm",
    });

    const contactStr = typeof orderData.contact === "string" ? orderData.contact.trim() : "";
    const isEmail = contactStr.includes("@");
    if (isEmail && createdOrder._id) {
      const emailTrimmed = contactStr.toLowerCase();
      const name = [orderData.firstName, orderData.lastName].filter(Boolean).join(" ") || undefined;
      try {
        const allContacts = await clientBackend.fetch<Array<{ _id: string; email: string; source?: string; subscribed?: boolean; orders?: Array<{ _ref: string }> }>>(
          `*[_type == "contact"] { _id, email, source, subscribed, orders[] { _ref } }`
        );
        
        const existing = allContacts.find(
          (c) => c.email && c.email.trim().toLowerCase() === emailTrimmed
        );

        const orderRef = { 
          _type: "reference" as const, 
          _ref: createdOrder._id,
          _key: `order-${createdOrder._id}`
        };

        if (existing) {
          const updates: Record<string, unknown> = {};
          if (orderData.subscribed && !existing.subscribed) {
            updates.subscribed = true;
          }
          if (name && !existing.name) {
            updates.name = name;
          }
          const existingOrderRefs = (existing.orders || []).map((o) => o._ref);
          if (!existingOrderRefs.includes(createdOrder._id)) {
            // Get existing order references with their keys
            const existingOrderItems = (existing.orders || []).map((o: { _ref: string; _key?: string }) => ({
              _type: "reference" as const,
              _ref: o._ref,
              _key: o._key || `order-${o._ref}`
            }));
            // Add the new order reference with key
            updates.orders = [...existingOrderItems, orderRef];
          }
          if (Object.keys(updates).length > 0) {
            await clientBackend.patch(existing._id).set(updates).commit();
          }
        } else {
          await clientBackend.create({
            _type: "contact",
            source: "order",
            email: emailTrimmed,
            name: name || undefined,
            subscribed: Boolean(orderData.subscribed),
            orders: [orderRef],
          });
        }
      } catch (e) {
        console.error("Failed to create/update contact from order:", e);
      }
    }

    return NextResponse.json({
      message: "Order created successfully",
      createdOrder,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error creating order", error },
      { status: 500 }
    );
  }
}
