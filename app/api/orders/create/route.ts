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
      status: "confirm",
    });

    const contactStr = typeof orderData.contact === "string" ? orderData.contact.trim() : "";
    const isEmail = contactStr.includes("@");
    if (isEmail && createdOrder._id) {
      const name = [orderData.firstName, orderData.lastName].filter(Boolean).join(" ") || undefined;
      try {
        await clientBackend.create({
          _type: "contact",
          source: "order",
          email: contactStr,
          name: name || undefined,
          subscribed: Boolean(orderData.subscribed),
          orderId: { _type: "reference", _ref: createdOrder._id },
        });
      } catch (e) {
        console.error("Failed to create contact from order:", e);
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
