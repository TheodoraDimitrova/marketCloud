import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseServer } from "@/lib/supabase/server";
import clientBackend from "@/sanity/lib/clientBackend";
import { getAllowedAdminEmails } from "@/lib/adminAccess";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowedEmails = await getAllowedAdminEmails();
    if (!allowedEmails.includes(email)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data: contact, error: contactError } = await supabaseServer
      .from("contacts")
      .select("id, created_at, name, email, source, subscribed, phone")
      .eq("id", id)
      .single();

    if (contactError || !contact) {
      if (contactError?.code === "PGRST116") {
        return NextResponse.json({ message: "Customer not found" }, { status: 404 });
      }
      console.error("Error fetching customer from Supabase:", contactError);
      return NextResponse.json(
        { message: "Error fetching customer" },
        { status: 500 }
      );
    }

    // Fetch orders by email
    const { data: ordersRows, error: ordersError } = await supabaseServer
      .from("orders")
      .select("id, order_number, created_at, total_amount, payment_status, status")
      .eq("contact", contact.email)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders for customer:", ordersError);
    }

    const orders =
      ordersRows?.map((o) => ({
        _id: o.id as string,
        orderNumber:
          o.order_number || (o.id as string).slice(-8).toUpperCase(),
        _createdAt: o.created_at as string,
        totalAmount: o.total_amount,
        paymentStatus: o.payment_status,
        status: o.status,
      })) ?? [];

    // Fetch messages by email
    const { data: messagesRows, error: messagesError } = await supabaseServer
      .from("messages")
      .select("id, created_at, message, enquiry_type, status")
      .eq("email", contact.email)
      .order("created_at", { ascending: false });

    if (messagesError) {
      console.error("Error fetching messages for customer:", messagesError);
    }

    const messages =
      messagesRows?.map((m) => ({
        _id: m.id as string,
        _createdAt: m.created_at as string,
        message: m.message,
        enquiryType: m.enquiry_type ?? undefined,
        status: m.status ?? undefined,
      })) ?? [];

    // Fetch reviews from Supabase by email (include product_id)
    const { data: reviewsRows, error: reviewsError } = await supabaseServer
      .from("product_reviews")
      .select("id, created_at, rating, comment, product_id")
      .eq("email", contact.email)
      .order("created_at", { ascending: false });

    if (reviewsError) {
      console.error("Error fetching reviews for customer:", reviewsError);
    }

    const productIds = [
      ...new Set(
        (reviewsRows ?? [])
          .map((r) => r.product_id as string | null)
          .filter((id): id is string => Boolean(id))
      ),
    ];

    let productMap: Record<string, { name: string; slug: string }> = {};
    if (productIds.length > 0) {
      try {
        const products = await clientBackend.fetch<
          { _id: string; name: string; slug: string }[]
        >(
          `*[_type == "product" && _id in $ids]{ _id, name, "slug": slug.current }`,
          { ids: productIds }
        );
        productMap = (products ?? []).reduce<Record<string, { name: string; slug: string }>>(
          (acc, p) => {
            acc[p._id] = { name: p.name ?? "Unknown", slug: p.slug ?? "" };
            return acc;
          },
          {}
        );
      } catch (e) {
        console.error("Error fetching product names for reviews:", e);
      }
    }

    const reviews =
      reviewsRows?.map((r) => {
        const productId = (r.product_id as string) ?? "";
        const product = productMap[productId];
        return {
          _id: r.id as string,
          _createdAt: r.created_at as string,
          rating: r.rating,
          comment: r.comment,
          productId: productId || undefined,
          productName: product?.name,
          productSlug: product?.slug,
        };
      }) ?? [];

    return NextResponse.json({
      _id: contact.id,
      _createdAt: contact.created_at,
      name: contact.name,
      email: contact.email,
      source: contact.source,
      subscribed: contact.subscribed,
      orders,
      messages,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { message: "Error fetching customer" },
      { status: 500 }
    );
  }
}
