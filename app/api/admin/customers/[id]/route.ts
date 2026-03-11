import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientBackend from "@/sanity/lib/clientBackend";
import { supabaseServer } from "@/lib/supabase/server";

const ADMIN_ACCESS_QUERY = `*[_type == "adminAccess"][0].emails`;

async function getAllowedAdminEmails(): Promise<string[]> {
  try {
    const emails = await clientBackend.fetch<string[]>(ADMIN_ACCESS_QUERY);
    return Array.isArray(emails) ? emails.filter((e) => typeof e === "string" && e.includes("@")) : [];
  } catch {
    return [];
  }
}

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

    // Reviews are still in Sanity – for now return empty array
    const reviews: unknown[] = [];

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
